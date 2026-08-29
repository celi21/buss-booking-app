import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import User from '../models/user.js';

// Safely extract only the base origin from BACKEND_URL
// (guards against accidentally setting BACKEND_URL to a full path like .../api/oauth/google/callback)
const backendBase = (() => {
    try {
        return new URL(process.env.BACKEND_URL || '').origin;
    } catch {
        return process.env.BACKEND_URL || '';
    }
})();

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${backendBase}/api/oauth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // User exists, update OAuth info if needed
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        isAdmin: false,
                        password: Math.random().toString(36).slice(-8), // Random password (won't be used)
                    });

                    await user.save();
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
    console.log('✓ Google OAuth strategy initialized');
} else {
    console.log('⚠ Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

// Apple OAuth Strategy (only if credentials are provided)
if (
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    (process.env.APPLE_PRIVATE_KEY_PATH || process.env.APPLE_PRIVATE_KEY)
) {
    passport.use(
        new AppleStrategy(
            {
                clientID: process.env.APPLE_CLIENT_ID,
                teamID: process.env.APPLE_TEAM_ID,
                keyID: process.env.APPLE_KEY_ID,
                // Support both a file path (Secret File on Render) or raw key string (env var)
                // Note: When pasted as an env var, Render stores \n as literal escape sequences.
                // We normalize them back to real newlines so the key is valid.
                ...(process.env.APPLE_PRIVATE_KEY_PATH
                    ? { privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH }
                    : { privateKeyString: (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n') }),
                callbackURL: `${backendBase}/api/oauth/apple/callback`,
            },
            async (accessToken, refreshToken, idToken, profile, done) => {
                try {
                    // idToken.sub is Apple's unique stable user identifier (always present)
                    // idToken.email is ONLY sent on the very first authorization — never again after that
                    const appleId = idToken.sub;
                    const email = idToken.email;

                    // First: try to find the user by their Apple ID (works on all logins after the first)
                    let user = await User.findOne({ appleId });

                    if (user) {
                        // Update email if Apple finally provided one and we didn't have it
                        if (email && !user.email) {
                            user.email = email;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Second: if no Apple ID match, try email (handles linking to existing account)
                    if (email) {
                        user = await User.findOne({ email });
                        if (user) {
                            user.appleId = appleId;
                            await user.save();
                            return done(null, user);
                        }
                    }

                    // New user — Apple must provide email on first sign-in to create an account
                    if (!email) {
                        // This happens when the user previously approved the app but we have no record.
                        // They must revoke app access in Apple ID settings and sign in again.
                        return done(null, false, { message: 'apple_no_email' });
                    }

                    // Create new user
                    user = new User({
                        name: profile.name?.firstName
                            ? `${profile.name.firstName} ${profile.name.lastName || ''}`.trim()
                            : 'Apple User',
                        email,
                        appleId,
                        isAdmin: false,
                        password: Math.random().toString(36).slice(-8),
                    });

                    await user.save();
                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
    console.log('✓ Apple OAuth strategy initialized');
} else {
    console.log('⚠ Apple OAuth not configured (missing required environment variables)');
}

export default passport;

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
                ...(process.env.APPLE_PRIVATE_KEY_PATH
                    ? { privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH }
                    : { privateKeyString: process.env.APPLE_PRIVATE_KEY }),
                callbackURL: `${backendBase}/api/oauth/apple/callback`,
            },
            async (accessToken, refreshToken, idToken, profile, done) => {
                try {
                    // Apple provides email in idToken
                    const email = idToken.email;

                    // Check if user already exists
                    let user = await User.findOne({ email });

                    if (user) {
                        // User exists, update OAuth info if needed
                        if (!user.appleId) {
                            user.appleId = profile.id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user
                    user = new User({
                        name: profile.name?.firstName
                            ? `${profile.name.firstName} ${profile.name.lastName || ''}`.trim()
                            : 'Apple User',
                        email,
                        appleId: profile.id,
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
    console.log('✓ Apple OAuth strategy initialized');
} else {
    console.log('⚠ Apple OAuth not configured (missing required environment variables)');
}

export default passport;

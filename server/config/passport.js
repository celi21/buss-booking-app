import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import User from '../models/user.js';

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

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
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

// Apple OAuth Strategy
passport.use(
    new AppleStrategy(
        {
            clientID: process.env.APPLE_CLIENT_ID,
            teamID: process.env.APPLE_TEAM_ID,
            keyID: process.env.APPLE_KEY_ID,
            privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/apple/callback`,
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

export default passport;

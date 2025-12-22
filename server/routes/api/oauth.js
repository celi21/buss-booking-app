import express from 'express';
import passport from '../../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Check if Apple OAuth is configured
const isAppleConfigured = !!(
    process.env.APPLE_CLIENT_ID &&
    process.env.APPLE_TEAM_ID &&
    process.env.APPLE_KEY_ID &&
    (process.env.APPLE_PRIVATE_KEY_PATH || process.env.APPLE_PRIVATE_KEY)
);

// Google OAuth routes
router.get('/google', (req, res, next) => {
    if (!isGoogleConfigured) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_configured`);
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get(
    '/google/callback',
    (req, res, next) => {
        if (!isGoogleConfigured) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_not_configured`);
        }
        next();
    },
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google` }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, isAdmin: req.user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// Apple OAuth routes
router.get('/apple', (req, res, next) => {
    if (!isAppleConfigured) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=apple_not_configured`);
    }
    passport.authenticate('apple', { scope: ['name', 'email'] })(req, res, next);
});

router.post(
    '/apple/callback',
    (req, res, next) => {
        if (!isAppleConfigured) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=apple_not_configured`);
        }
        next();
    },
    passport.authenticate('apple', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=apple` }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, isAdmin: req.user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

export default router;

import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import passport from '../lib/passport.js';
import { generateToken } from '../lib/utils.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check-auth', protectRoute, checkAuth);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: true,
  }),
  (req, res) => {
    // Issue JWT for the user
    generateToken(req.user._id, res);
    // Redirect to frontend
    res.redirect('http://localhost:5173');
  }
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({ message: 'Google authentication failed' });
});

export default router;
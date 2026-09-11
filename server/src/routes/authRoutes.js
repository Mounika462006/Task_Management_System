const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validationMiddleware');
const {
  loginSchema,
  registerEmployeeSchema,
  verifyOtpSchema,
  resendOtpSchema,
} = require('../validators/authValidator');

const router = express.Router();

// Basic rate limiting on login endpoint to mitigate brute-force attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

// Rate limiting on registration / OTP endpoints
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
  },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again later.',
  },
});

router.post('/login', loginLimiter, validateBody(loginSchema), authController.login);
router.post('/register', registerLimiter, validateBody(registerEmployeeSchema), authController.register);
router.post('/verify-otp', otpLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', otpLimiter, validateBody(resendOtpSchema), authController.resendOtp);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;

const express      = require('express');
const AuthController = require('./auth.controller');
const {
  validateSignup,
  validateLogin,
  validateSendOtp,
  validateVerifyOtp,
  validateRefresh,
  validateLogout,
  validateUpdatePassword,
  validateAssignRolePermission,
} = require('./auth.validator');
const authenticate = require('../../shared/middlewares/authenticate');

const router = express.Router();

// ── PUBLIC routes ─────────────────────────────────────────

/**
 * @route  POST /api/auth/signup
 * @desc   Daftar akun baru, kirim OTP ke email
 * @access Public
 */
router.post('/signup', validateSignup, AuthController.signup);

/**
 * @route  POST /api/auth/send-otp
 * @desc   Kirim / resend OTP untuk berbagai keperluan
 * @access Public
 * @body   { email, purpose: EMAIL_VERIFY | PASSWORD_RESET | ... }
 */
router.post('/send-otp', validateSendOtp, AuthController.sendOtp);

/**
 * @route  POST /api/auth/verify-otp
 * @desc   Verifikasi OTP. Jika EMAIL_VERIFY → return JWT langsung
 * @access Public
 * @body   { email, otp, purpose }
 */
router.post('/verify-otp', validateVerifyOtp, AuthController.verifyOtp);

/**
 * @route  POST /api/auth/login
 * @desc   Login dengan email atau username + password
 * @access Public
 * @body   { identifier: email|username, password }
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @route  POST /api/auth/refresh
 * @desc   Refresh access token menggunakan refresh token
 * @access Public
 * @body   { refreshToken }
 */
router.post('/refresh', validateRefresh, AuthController.refresh);

// ── PROTECTED routes ──────────────────────────────────────

/**
 * @route  POST /api/auth/logout
 * @desc   Revoke semua token user
 * @access Private
 * @body   { refreshToken }
 */
router.post('/logout', authenticate, validateLogout, AuthController.logout);

/**
 * @route  GET /api/auth/me
 * @desc   Ambil data user yang sedang login + roles + permissions
 * @access Private
 */
router.get('/me', authenticate, AuthController.me);

/**
 * @route  POST /api/auth/update-password
 * @desc   update password user
 * @access Private
 */
router.post('/update-password', authenticate, validateUpdatePassword, AuthController.updatePassword);

/**
 * @route  GET /api/auth/roles
 * @desc   mengambil semua data di table roles
 * @access Private
 */
router.get('/roles',  AuthController.findAllRoles);

/**
 * @route  GET /api/auth/modules
 * @desc   mengambil semua data di table permissions
 * @access Private
 */
router.get('/modules',  AuthController.findAllModules);

/**
 * @route  POST /api/auth/role-modules
 * @desc   assign role & permission
 * @access Private
 */
router.post('/role-modules', validateAssignRolePermission, AuthController.assignRolePermission);

module.exports = router;

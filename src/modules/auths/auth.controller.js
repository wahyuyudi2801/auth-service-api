const AuthService = require('./auth.service');
const response = require('../../shared/utils/response');

// Helper ambil meta dari request
const getMeta = (req) => ({
  ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
  userAgent: req.headers['user-agent'] || 'unknown',
});

const AuthController = {

  // POST /auth/signup
  async signup(req, res, next) {
    try {
      const { username, email, password, fullName } = req.body; //ekstrak data json ke variables
      const data = await AuthService.signup(
        { username, email, password, fullName },
        getMeta(req)
      );
      response.success(res, data, 'Registrasi berhasil. Cek email untuk kode OTP.', 201);
    } catch (e) { next(e); }
  },

  // POST /auth/send-otp
  async sendOtp(req, res, next) {
    try {
      const { email, purpose } = req.body;
      const data = await AuthService.sendOtp({ email, purpose }, getMeta(req));
      response.success(res, data, 'OTP berhasil dikirim');
    } catch (e) { next(e); }
  },

  // POST /auth/verify-otp
  async verifyOtp(req, res, next) {
    try {
      const { email, otp, purpose } = req.body;
      const data = await AuthService.verifyOtp({ email, otp, purpose }, getMeta(req));
      response.success(res, data, data.message || 'OTP berhasil diverifikasi');
    } catch (e) { next(e); }
  },

  // POST /auth/login
  async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      const data = await AuthService.login({ identifier, password }, getMeta(req));
      response.success(res, data, 'Login berhasil');
    } catch (e) { next(e); }
  },

  // POST /auth/refresh
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refreshToken({ refreshToken }, getMeta(req));
      response.success(res, data, 'Token berhasil diperbarui');
    } catch (e) { next(e); }
  },

  // POST /auth/logout
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.logout(
        { userId: req.user.sub, jti: req.user.jti, refreshToken },
        getMeta(req)
      );
      response.success(res, data, 'Logout berhasil');
    } catch (e) { next(e); }
  },

  // GET /auth/me
  async me(req, res, next) {
    try {
      const data = await AuthService.me(req.user.sub);
      response.success(res, data, 'Data user berhasil diambil');
    } catch (e) { next(e); }
  },

  // POST /auth/update-password
  async updatePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const email = req.user.email;
      const data = await AuthService.updatePassword(
        { email, oldPassword, newPassword },
        getMeta(req)
      );
      
      response.success(res, data, 'Password user berhasil diperbarui.');
    } catch (e) { next(e); }
  },

  async findAllRoles(req, res, next) {
    try {
      const data = await AuthService.getRoles()
      response.success(res, data, 'Data roles berhasil diambil')
    } catch (error) {
      next(error)
    }
  },

  async findAllModules(req, res, next) {
    try {
      const data = await AuthService.getModules()
      response.success(res, data, 'Modules/Permissions berhasil diambil')
    } catch (error) {
      next(error)
    }
  },

  async assignRolePermission(req, res, next) {
    try {
      const { role_grants, permissions } = req.body;
      const data = await AuthService.assignRolePermission(role_grants, permissions)
      response.success(res, data, 'Assign role & permission berhasil')
    } catch (error) {
      next(error)
    }
  }
};

module.exports = AuthController;

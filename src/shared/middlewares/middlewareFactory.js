// ── Middleware factory ────────────────────────────────────
const AppError = require('../../shared/utils/AppError');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(e => e.message);
    return next(new AppError('Validasi gagal', 422, errors));
  }
  req.body = result.data; // pakai data yang sudah di-sanitize Zod
  next();
};

module.exports = validate;
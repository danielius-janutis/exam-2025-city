/**
 * domainErrors - helper to send standardized domain error responses
 * Usage:
 *   const domainErrors = require('../utils/domainErrors');
 *   return domainErrors.send(res, 'USER_NOT_FOUND', { message: 'User not found' });
 */

const TYPE_MAP = {
  VALIDATION_ERROR: { status: 400, defaultMessage: 'Validation error' },
  INVALID_CREDENTIALS: { status: 401, defaultMessage: 'Invalid credentials' },
  USER_NOT_FOUND: { status: 404, defaultMessage: 'Resource not found' },
  CONFLICT: { status: 409, defaultMessage: 'Conflict' },
  FORBIDDEN: { status: 403, defaultMessage: 'Forbidden' },
  SERVER_ERROR: { status: 500, defaultMessage: 'Server error' },
  OK: { status: 200, defaultMessage: 'OK' },
};

function buildPayload(type, opts = {}) {
  const info = TYPE_MAP[type] || TYPE_MAP.SERVER_ERROR;
  return {
    status: info.status === 200 ? 'success' : 'error',
    errorType: type,
    statusCode: info.status,
    message: opts.message || info.defaultMessage,
    details: opts.details || null,
  };
}

const domainErrors = {
  send(res, type = 'SERVER_ERROR', opts = {}) {
    const payload = buildPayload(type, opts);
    return res.status(payload.statusCode).json(payload);
  },

  // convenience helpers
  validation(res, details, message) {
    return this.send(res, 'VALIDATION_ERROR', { details, message });
  },

  notFound(res, message) {
    return this.send(res, 'USER_NOT_FOUND', { message });
  },

  conflict(res, message) {
    return this.send(res, 'CONFLICT', { message });
  },

  authFailed(res, message) {
    return this.send(res, 'INVALID_CREDENTIALS', { message });
  },

  serverError(res, err) {
    const message = err && err.message ? err.message : undefined;
    return this.send(res, 'SERVER_ERROR', { message });
  },
};

export default domainErrors;
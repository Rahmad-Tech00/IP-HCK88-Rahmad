module.exports = (err, req, res, _next) => {
  console.error('=== ERROR HANDLER ===');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('====================');
  
  const map = {
    Unauthenticated: [401, 'Invalid or missing token'],
    JsonWebTokenError: [401, 'Invalid token'],
    SequelizeUniqueConstraintError: [400, err?.errors?.[0]?.message || 'Unique constraint error'],
    SequelizeValidationError: [400, err?.errors?.[0]?.message || 'Validation error']
  };
  const [status, message] = map[err.name] || [500, 'Internal Server Error'];
  res.status(status).json({ message });
};
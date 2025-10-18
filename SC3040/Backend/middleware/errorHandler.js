// Add this middleware to your server.js BEFORE your routes
// Global error logging middleware

const globalErrorHandler = (err, req, res, next) => {
  console.error('🚨 GLOBAL ERROR HANDLER TRIGGERED');
  console.error('================================');
  console.error('📍 URL:', req.method, req.originalUrl);
  console.error('📋 Query:', req.query);
  console.error('📄 Body:', req.body);
  console.error('🕐 Timestamp:', new Date().toISOString());
  console.error('❌ Error Details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
  console.error('================================\n');

  // Send error response
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
      timestamp: new Date().toISOString(),
      requestId: `err_${Date.now()}`
    });
  }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`, {
    query: req.query,
    body: req.method === 'POST' ? req.body : undefined,
    timestamp: new Date().toISOString()
  });
  next();
};

module.exports = { globalErrorHandler, requestLogger };

// Comprehensive debugging utility for Express/Supabase apps
// Add this to the top of your routes or server.js

const createDebugLogger = (routeName) => {
  return {
    info: (message, data = {}) => {
      console.log(`🔍 [${routeName}] ${message}`, {
        timestamp: new Date().toISOString(),
        ...data
      });
    },
    error: (message, error, context = {}) => {
      console.error(`❌ [${routeName}] ${message}`, {
        timestamp: new Date().toISOString(),
        error: {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
          code: error?.code
        },
        context,
        // If it's a Supabase error
        supabaseError: error?.details ? {
          details: error.details,
          hint: error.hint,
          code: error.code
        } : null,
        // If it's an Axios error
        axiosError: error?.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response.data
        } : null
      });
    },
    success: (message, data = {}) => {
      console.log(`✅ [${routeName}] ${message}`, {
        timestamp: new Date().toISOString(),
        ...data
      });
    },
    warning: (message, data = {}) => {
      console.warn(`⚠️ [${routeName}] ${message}`, {
        timestamp: new Date().toISOString(),
        ...data
      });
    }
  };
};

// Enhanced error response helper
const sendErrorResponse = (res, error, context = {}) => {
  const logger = createDebugLogger('ErrorHandler');
  
  let statusCode = 500;
  let errorType = 'Internal Server Error';
  let userMessage = 'An unexpected error occurred';
  
  // Categorize errors
  if (error?.response) {
    // External API error
    statusCode = error.response.status === 404 ? 503 : 500;
    errorType = 'External API Error';
    userMessage = 'External service is currently unavailable';
  } else if (error?.code?.startsWith('PGRST')) {
    // Supabase/PostgreSQL error
    statusCode = 500;
    errorType = 'Database Error';
    userMessage = 'Database operation failed';
  } else if (error?.code === 'ENOTFOUND' || error?.code === 'ETIMEDOUT') {
    // Network error
    statusCode = 503;
    errorType = 'Network Error';
    userMessage = 'Service is currently unavailable';
  } else if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
    // Validation error
    statusCode = 400;
    errorType = 'Validation Error';
    userMessage = error.message;
  }
  
  logger.error(`${errorType}: ${error?.message}`, error, context);
  
  const errorResponse = {
    error: userMessage,
    type: errorType,
    timestamp: new Date().toISOString(),
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  // Add details in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.details = {
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    };
  }
  
  res.status(statusCode).json(errorResponse);
};

// Test Supabase connection health
const testSupabaseHealth = async (supabase, logger) => {
  try {
    logger.info('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      logger.error('Supabase health check failed', error);
      return false;
    }
    
    logger.success('Supabase connection healthy', { userCount: data?.length });
    return true;
  } catch (error) {
    logger.error('Supabase health check error', error);
    return false;
  }
};

// Test external API health
const testExternalAPIHealth = async (url, logger) => {
  try {
    logger.info('Testing external API...', { url });
    const response = await axios.get(url, { timeout: 5000 });
    logger.success('External API healthy', { status: response.status });
    return true;
  } catch (error) {
    logger.error('External API health check failed', error, { url });
    return false;
  }
};

module.exports = {
  createDebugLogger,
  sendErrorResponse,
  testSupabaseHealth,
  testExternalAPIHealth
};

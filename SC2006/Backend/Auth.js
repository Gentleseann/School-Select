const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const verifyToken = async (req, res, next) => {
  console.log('🔍 Auth middleware called:', {
    cookies: req.cookies,
    authHeader: req.headers.authorization,
    path: req.path
  });

  // Try to get JWT from multiple sources
  let token = req.cookies.accessToken; // From cookie
  
  // If no accessToken, try refreshToken as fallback
  if (!token && req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
    console.log('🔄 Using refreshToken as fallback');
  }
  
  // If no cookie token, try Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      token = authHeader; // Direct token
    }
  }

  // Check if token exists
  if (!token) { 
    console.log('❌ No token found in cookies or headers');
    return res.status(401).json({ 
      message: 'No token provided',
      details: 'Token must be provided either in cookies (accessToken) or Authorization header'
    });
  }

  console.log('🔑 Token found, verifying...');

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ 
        message: 'Invalid token',
        details: err.message
      });
    }

    console.log('✅ Token verified successfully:', {
      userId: decoded.userId,
      userName: decoded.userName
    });

    // If userId is missing, fetch it from database using userName
    let userId = decoded.userId;
    const userName = decoded.userName;

    if (!userId && userName) {
      console.log('🔍 userId missing, fetching from database using userName:', userName);
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('id')
          .eq('username', userName)
          .limit(1);

        if (error || !users || users.length === 0) {
          console.log('❌ Could not find user in database:', userName);
          return res.status(401).json({ 
            message: 'User not found',
            details: 'Invalid token - user does not exist'
          });
        }

        userId = users[0].id;
        console.log('✅ Found userId from database:', userId);
      } catch (dbError) {
        console.error('❌ Database error while fetching userId:', dbError);
        return res.status(500).json({ 
          message: 'Authentication database error',
          details: 'Could not verify user identity'
        });
      }
    }

    if (!userId) {
      console.log('❌ No user_id found in token or database');
      return res.status(401).json({ 
        error: "Authentication error", 
        details: "User ID not found in token" 
      });
    }

    // Set both userId and username to the request object for use in routes
    req.userId = userId;
    req.username = userName;
    
    console.log('✅ Authentication successful:', { userId: req.userId, username: req.username });
    next(); // Pass control to the next middleware or route handler
  });
};

module.exports = verifyToken;

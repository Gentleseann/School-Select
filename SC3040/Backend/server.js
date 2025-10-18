const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);



const app = express();
const PORT = process.env.PORT || 5001;
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:5174", // Alternative port
];


//Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

/// import jwt verification function which stores user_id
const verifyToken = require('./Auth')

// Import routes
const authRoutes = require('./routes/userLoginSignUp');
const PSGChatRoutes = require('./routes/PSGChatRoute');
const aftPriChatRoutes = require('./routes/aftPriChatRoutes');
const aftSecChatRoutes = require('./routes/aftSecChatRoute');

// Use routes
app.use('/api', authRoutes);
app.use('/api', PSGChatRoutes);
app.use('/api', aftPriChatRoutes);
app.use('/api', aftSecChatRoutes);

// Import the getSchoolData function
const getSchoolData = require('./database/getSchools');
const getCCAData = require('./database/getCCAs');
const getDistProgData = require('./database/getDistProg');
const getSubjectsData = require('./database/getSubjects');
const getMOEProgramsData = require('./database/getMOEProg');

// Update route definition to match the frontend
// Update route definition to match the frontend
app.get('/api/schools', async (req, res) => {
    try {
      // Use Promise.all to fetch both datasets concurrently

      const queryParamsName =  req.query.query
      const queryParamsLevel = req.query.level;
      const queryParamsLocation = req.query.location
      const querySort = req.query.sortBy;
      const queryNameLevel = {
        name: queryParamsName,
        level: queryParamsLevel,
        location: queryParamsLocation,
        sort: querySort
      };

      console.log("what the",req.query)
      const [schoolData, ccaData, distProgData, subjectsData, moeprogData] = await Promise.all([
        getSchoolData(queryNameLevel),
        getCCAData(queryParamsName || ''), // Pass just the name string
        getDistProgData(queryParamsName || ''), // Pass just the name string  
        getSubjectsData(queryParamsName || ''), // Pass just the name string
        getMOEProgramsData(queryParamsName || '')
      ]);
  
      // Log two examples to check what’s being sent to the client
      console.log("Example school data being sent to frontend:", schoolData.slice(0, 2));
      //console.log("Example CCA data being sent to frontend:", ccaData.slice(0, 2));
      //console.log("Example distProg data being sent to frontend:", distProgData.slice(0, 2)); 
      //console.log("Example subjects data being sent to frontend:", subjectsData.slice(0, 2)); 
     //console.log("Example MOE programmes data being sent to frontend:", moeprogData.slice(0, 2)); 
  
      // Return both datasets in a structured response
      res.json({ schools: schoolData, ccas: ccaData, distProgs:distProgData, subjects: subjectsData, moeprog: moeprogData }); // Send a single object
    } catch (error) {
      console.error("Error in /api/schools:", error);  // Add logging for debugging
      res.status(500).json({ error: "Failed to fetch school data" });
    }
  });
  


  app.post('/api/addToFav',verifyToken, async(req,res)=>{
    try {
      const school_name = req.body.data;
      console.log('Request Body:', school_name);
      const user_id = req.userId;
      console.log("id", user_id)
      const { data, error } = await supabase
        .from('fav_schools')
        .insert([{ school_name, user_id }]);
  
      return res.status(200).json({message:"Book added to bookshelf"})
    } catch (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "An error occurred while adding book" });
    }
  })

  // Add missing fetchFav endpoint
  app.get('/api/fetchFav', verifyToken, async(req, res) => {
    try {
      const user_id = req.userId;
      console.log("Fetching favorites for user:", user_id);
      
      const { data, error } = await supabase
        .from('fav_schools')
        .select('school_name')
        .eq('user_id', user_id);

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: "Failed to fetch favorites" });
      }

      return res.status(200).json({ favorites: data });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "An error occurred while fetching favorites" });
    }
  });

  // Add missing get-coordinates endpoint
  app.post('/api/get-coordinates', async(req, res) => {
    try {
      const { address } = req.body;
      console.log("Getting coordinates for address:", address);
      
      // For now, return mock coordinates - you can integrate with a geocoding service later
      // This prevents the 404 error and allows the app to function
      const mockCoordinates = {
        lat: 1.3521, // Singapore default latitude
        lng: 103.8198, // Singapore default longitude
        address: address
      };

      return res.status(200).json(mockCoordinates);
    } catch (error) {
      console.error("Error getting coordinates:", error);
      res.status(500).json({ error: "Failed to get coordinates" });
    }
  });

  // Add missing verify-access endpoint for chat
  app.post('/api/chat/verify-access', verifyToken, async(req, res) => {
    try {
      // If we reach this point, the token has been verified by the middleware
      console.log("User verified for chat access:", req.userId);
      
      return res.status(200).json({ 
        verified: true,
        userId: req.userId,
        username: req.username,
        message: "Access granted to chat"
      });
    } catch (error) {
      console.error("Error in verify-access:", error);
      res.status(500).json({ 
        verified: false,
        error: "Internal server error during verification" 
      });
    }
  });

  // Add a general session verification endpoint
  app.get('/api/verify-session', verifyToken, async(req, res) => {
    try {
      // If we reach this point, the token has been verified by the middleware
      console.log("Session verified for user:", req.userId);
      
      return res.status(200).json({ 
        valid: true,
        userId: req.userId,
        username: req.username,
        message: "Session is valid"
      });
    } catch (error) {
      console.error("Error in verify-session:", error);
      res.status(500).json({ 
        valid: false,
        error: "Internal server error during session verification" 
      });
    }
  });

  // Add endpoint without hyphen to match frontend calls
  app.get('/api/verifySession', verifyToken, async(req, res) => {
    try {
      // If we reach this point, the token has been verified by the middleware
      console.log("Session verified for user:", req.userId);
      
      return res.status(200).json({ 
        valid: true,
        userId: req.userId,
        username: req.username,
        message: "Session is valid"
      });
    } catch (error) {
      console.error("Error in verifySession:", error);
      res.status(500).json({ 
        valid: false,
        error: "Internal server error during session verification" 
      });
    }
  });

  // Add missing logout endpoint
  app.post('/api/logout', async(req, res) => {
    try {
      console.log("User logging out");
      
      // Clear all authentication cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
      
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });

      return res.status(200).json({ 
        message: "Logged out successfully",
        success: true
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ 
        error: "Internal server error during logout" 
      });
    }
  });


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

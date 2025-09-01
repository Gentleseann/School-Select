// routes/asChatRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const verifyToken = require('../Auth')

// Route to fetch all chat messages
router.get('/aschat/:school_id', async (req, res) => {
  const{school_id}=req.params;

  try {
    // Fetching all messages from the 'asChat' table
    const { data: messages, error } = await supabase
      .from('AsChat')
      .select('*')
      .eq('school_id', school_id) // Filter messages by school_id
      .order('created_at', { ascending: true }); // Order by timestamp ascending

    if (error) {
      throw new Error('Error fetching messages');
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to post a new message
router.post('/aschat/messages', verifyToken, async (req, res) => {
  const { message, school_id } = req.body;
  const username = req.username;
  
  try {
    console.log('🔍 Creating new AS chat message:', {
      username: username,
      school_id: school_id,
      messageLength: message?.length,
      hasMessage: !!message
    });

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: "Invalid message",
        details: "Message cannot be empty"
      });
    }
    
    if (!school_id || isNaN(school_id)) {
      return res.status(400).json({ 
        error: "Invalid school_id",
        details: "school_id must be a valid number"
      });
    }

    if (!username) {
      return res.status(400).json({ 
        error: "Authentication error",
        details: "Username not found in token"
      });
    }

    // ✅ FIX: Include username in message since table doesn't have username column
    // Format: "username: actual_message" so frontend can parse and display properly
    const messageWithUsername = `${username}: ${message.trim()}`;
    
    const { data, error } = await supabase
      .from('AsChat')
      .insert([{ 
        message: messageWithUsername, 
        school_id: parseInt(school_id)
      }])
      .select("*");

    if (error) {
      console.error('❌ Supabase error in AS chat insert:', error);
      return res.status(500).json({ 
        error: "Database error while posting message",
        details: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ 
        error: "Message insert failed",
        details: "No data returned from database"
      });
    }

    console.log('✅ Successfully created AS chat message');
    
    // 🔧 FIX: Return message with username info for frontend display
    const result = { 
      ...data[0], 
      username: req.username 
    };
    
    res.status(201).json(result);

  } catch (error) {
    console.error('❌ Unexpected error in AS chat post:', error);
    res.status(500).json({ 
      error: "Internal server error",
      details: "An unexpected error occurred while posting the message"
    });
  }
});

module.exports = router;

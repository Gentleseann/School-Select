// routes/PSGChatRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const verifyToken = require('../Auth')

// 🚀 PERFORMANCE: Simple in-memory cache
const messageCache = new Map();
const CACHE_TTL = 30000; // 30 seconds cache

// Route to fetch all chat messages
router.get('/psgchat/:school_id', async (req, res) => {
  const { school_id } = req.params;

  try {
    console.log('🔍 Fetching PSG chat messages for school_id:', school_id);
    
    // Input validation
    if (!school_id || isNaN(school_id)) {
      console.log('❌ Invalid school_id provided:', school_id);
      return res.status(400).json({ 
        error: "Invalid school_id parameter",
        details: "school_id must be a valid number"
      });
    }

    // 🚀 PERFORMANCE: Check cache first
    const cacheKey = `psg_${school_id}`;
    const cached = messageCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log('✅ Returning cached PSG messages for school_id:', school_id);
      return res.status(200).json(cached.data);
    }

    // Fetching all messages from the 'PsgChat' table
    const { data: messages, error } = await supabase
      .from('PsgChat')
      .select('*')
      .eq('school_id', school_id) // Filter messages by school_id
      .order('created_at', { ascending: true }); // Order by timestamp ascending

    if (error) {
      console.error('❌ Supabase error in PSG chat fetch:', {
        error: error,
        school_id: school_id,
        timestamp: new Date().toISOString()
      });
      
      return res.status(500).json({ 
        error: "Database error while fetching messages",
        details: error.message,
        code: error.code || 'UNKNOWN_DB_ERROR'
      });
    }

    console.log(`✅ Successfully fetched ${messages?.length || 0} PSG chat messages`);
    
    // 🚀 PERFORMANCE: Cache the results
    messageCache.set(cacheKey, {
      data: messages || [],
      timestamp: Date.now()
    });
    
    res.status(200).json(messages || []);
    
  } catch (error) {
    console.error('❌ Unexpected error in PSG chat fetch:', {
      error: error.message,
      stack: error.stack,
      school_id: school_id,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: "Internal server error",
      details: "An unexpected error occurred while fetching chat messages",
      requestId: Date.now() // Help with debugging
    });
  }
});

// Route to post a new message
router.post('/psgchat/messages', verifyToken, async (req, res) => {
  const { message, school_id } = req.body;
  const username = req.username;
  
  try {
    console.log('🔍 Creating new PSG chat message:', {
      userId: req.userId,
      username: username,
      school_id: school_id,
      messageLength: message?.length,
      hasMessage: !!message
    });
    
    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('❌ Invalid message provided');
      return res.status(400).json({ 
        error: "Invalid message",
        details: "Message cannot be empty"
      });
    }
    
    if (!school_id || isNaN(school_id)) {
      console.log('❌ Invalid school_id provided:', school_id);
      return res.status(400).json({ 
        error: "Invalid school_id",
        details: "school_id must be a valid number"
      });
    }

    if (!username) {
      console.log('❌ Username not found in token');
      return res.status(400).json({ 
        error: "Authentication error",
        details: "Username not found in token"
      });
    }

    // ✅ FIX: Include username in message since table doesn't have username column
    // Format: "username: actual_message" so frontend can parse and display properly
    const messageWithUsername = `${username}: ${message.trim()}`;

    const { data, error } = await supabase
      .from('PsgChat')
      .insert([{ 
        message: messageWithUsername, 
        school_id: parseInt(school_id)
        // Note: created_at is auto-generated
        // Note: id is auto-increment
      }])
      .select("*");

    if (error) {
      console.error('❌ Supabase error in PSG chat insert:', {
        error: error,
        userId: req.userId,
        username: username,
        school_id: school_id,
        timestamp: new Date().toISOString()
      });
      
      return res.status(500).json({ 
        error: "Database error while posting message",
        details: error.message,
        code: error.code || 'UNKNOWN_DB_ERROR'
      });
    }

    if (!data || data.length === 0) {
      console.error('❌ No data returned from Supabase insert');
      return res.status(500).json({ 
        error: "Message insert failed",
        details: "No data returned from database"
      });
    }

    console.log('✅ Successfully created PSG chat message');
    
    // 🔧 FIX: Return message with username info for frontend display
    // Since table doesn't store username, we add it from JWT for client convenience
    const result = { 
      ...data[0], 
      username: req.username // Add username for frontend display
    };
    
    res.status(201).json(result);

  } catch (error) {
    console.error('❌ Unexpected error in PSG chat post:', {
      error: error.message,
      stack: error.stack,
      userId: req.userId,
      username: req.username,
      school_id: school_id,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: "Internal server error",
      details: "An unexpected error occurred while posting the message",
      requestId: Date.now()
    });
  }
});

module.exports = router;

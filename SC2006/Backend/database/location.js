const express = require('express');
const axios = require('axios');

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
    // 🔧 FIX: Return default Singapore coordinates if no API key
    if (!API_KEY || API_KEY === 'undefined') {
        console.log('⚠️ Google Maps API key not configured, returning default Singapore coordinates');
        return { 
            lat: 1.3521, 
            lng: 103.8198 // Singapore coordinates
        };
    }

    const cachedCoordinates = {};

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${API_KEY}`,
            { timeout: 5000 } // Add timeout
        );

        console.log("✅ Geocoding response status:", response.status);

        if (response.data && response.data.results && response.data.results[0]) {
            const location = response.data.results[0].geometry.location;
            cachedCoordinates[address] = location;
            console.log('✅ Found coordinates for address:', cachedCoordinates[address]);
            return cachedCoordinates[address];
        } else {
            console.log('⚠️ No geocoding results found, using default coordinates');
            return { 
                lat: 1.3521, 
                lng: 103.8198 
            };
        }
    } catch (error) {
        console.error('❌ Geocoding API error:', error.message);
        // Return default Singapore coordinates on error
        return { 
            lat: 1.3521, 
            lng: 103.8198 
        };
    }
}

module.exports = getCoordsForAddress;
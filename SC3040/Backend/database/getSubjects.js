// backend/database/getSubjects.js
const axios = require('axios');

const subjectsData = "d_0166018b072b9d8e06f4f0f3b89bd87b";
const url = "https://data.gov.sg/api/action/datastore_search?resource_id=" + subjectsData; 

// Function to get data from the API
async function getSubjectsData(queryParams) {
    try {
      console.log('🔍 getSubjectsData called with:', queryParams);
      
      // ⚠️ TEMPORARILY DISABLED: Subjects API resource ID is invalid (404 error)
      // Need to find the correct resource ID from data.gov.sg
      console.log('⚠️ Subjects API temporarily disabled due to invalid resource ID');
      console.log('⚠️ Returning empty array for subjects data');
      return [];
      
      /* DISABLED CODE - KEEP FOR REFERENCE
      // Handle empty/undefined queries
      if (!queryParams || typeof queryParams !== 'string' || queryParams.trim().length === 0) {
        console.log('⚠️ Empty query parameter for subjects, returning empty array');
        return [];
      }
      
      // 🔧 FIX: Clean the query to avoid 409 conflicts
      const cleanQuery = queryParams
        .replace(/[^\w\s]/gi, '') // Remove special characters
        .trim();
        
      if (cleanQuery.length < 3) {
        console.log('⚠️ Query too short after cleaning, returning empty array');
        return [];
      }
      
      // Use simpler query format to avoid API conflicts
      const fullUrl = `${url}&q=${encodeURIComponent(cleanQuery)}`;
      
      console.log('🌐 Subjects API request:', fullUrl);
      
      const response = await axios.get(fullUrl, {
        timeout: 8000, // Shorter timeout
        headers: {
          'User-Agent': 'School4U-App/1.0',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Subjects API response status:', response.status);

      if (!response.data || !response.data.result || !response.data.result.records) {
        console.log('⚠️ Subjects API returned no records');
        return [];
      }
  
      const subjects = response.data.result.records || [];
  
      const processedSubjects = subjects.length > 0
        ? subjects.map((subject, index) => ({
            id: index + 1,
            school_name: subject.School_name || subject.school_name, // Handle both field variations
            level: subject.level_id,
            subject: subject.subject_desc,
          }))
        : [];
      */

      console.log(`✅ getSubjectsData returning ${processedSubjects.length} records`);
      return processedSubjects;
      
    } catch (error) {
      console.error("❌ Error in getSubjectsData:", error.message);
      // Return empty array instead of throwing
      console.log('⚠️ Returning empty array due to subjects fetch error');
      return [];
    }
  }
  

module.exports = getSubjectsData;

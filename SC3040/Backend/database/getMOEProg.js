
const axios = require('axios');

const moeprogs = "d_b0697d22a7837a4eddf72efb66a36fc2"
const url = "https://data.gov.sg/api/action/datastore_search?resource_id="  + moeprogs; 

// Function to get data from the API
async function getMOEProgramsData(queryParams) {
    try {
      console.log('🔍 getMOEProgramsData called with:', queryParams);
      
      // Handle empty/undefined queries
      if (!queryParams || typeof queryParams !== 'string' || queryParams.trim().length === 0) {
        console.log('⚠️ Empty query parameter for MOE programs, returning empty array');
        return [];
      }
      
      const queryString = JSON.stringify({ school_name: queryParams.trim() });
      const response = await axios.get(`${url}&q=${queryString}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'School4U-App/1.0'
        }
      });

      if (!response.data || !response.data.result || !response.data.result.records) {
        console.log('⚠️ MOE Programs API returned no records');
        return [];
      }
  
      const moeprogs = response.data.result.records || [];
  
      const processedMOEProgs = moeprogs.length > 0
        ? moeprogs.map((moeprog, index) => ({
            id: index + 1,
            school_name: moeprog.School_name || moeprog.school_name, // ✅ FIX: Handle both field variations
            category: moeprog.moe_programme_desc,
          }))
        : [];

      console.log(`✅ getMOEProgramsData returning ${processedMOEProgs.length} records`);
      return processedMOEProgs;
      
    } catch (error) {
      console.error("❌ Error in getMOEProgramsData:", error.message);
      // Return empty array instead of throwing
      console.log('⚠️ Returning empty array due to MOE programs fetch error');
      return [];
    }
  }
  

module.exports = getMOEProgramsData;

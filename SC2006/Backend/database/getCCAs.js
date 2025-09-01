// backend/database/getCCAs.js
const axios = require('axios');

const CCAdata = "d_9aba12b5527843afb0b2e8e4ed6ac6bd"
const url = "https://data.gov.sg/api/action/datastore_search?resource_id="  + CCAdata; 

// Function to get data from the API
async function getCCAData(queryParamsCCA) {
    try {
      console.log('🔍 getCCAData called with:', queryParamsCCA);
      
      // Handle empty/undefined queries - return empty array instead of crashing
      if (!queryParamsCCA || typeof queryParamsCCA !== 'string' || queryParamsCCA.trim().length === 0) {
        console.log('⚠️ Empty query parameter, returning empty array');
        return [];
      }

      // 🔧 FIX: Clean the query to avoid 409 conflicts and improve partial matching
      // Remove special characters that might cause API issues
      const cleanQuery = queryParamsCCA
        .replace(/\b(primary|secondary)\s+school\b/gi, '$1')
        .replace(/[^\w\s]/gi, '') // Remove special characters
        .trim();
        
      if (cleanQuery.length < 2) { // Reduced from 3 to 2 for better partial matching
        console.log('⚠️ Query too short after cleaning, returning empty array');
        return [];
      }
      
      // Use a simpler query format to avoid conflicts
      const fullUrl = `${url}&q=${encodeURIComponent(cleanQuery)}`;
      
      console.log('🌐 Making API request to:', fullUrl);
      
      const response = await axios.get(fullUrl, {
        timeout: 8000, // Shorter timeout to fail faster
        headers: {
          'User-Agent': 'School4U-App/1.0',
          'Accept': 'application/json'
        }
      }); 

      console.log('✅ API Response status:', response.status);
      
      // Handle cases where API returns no data
      if (!response.data || !response.data.result || !response.data.result.records) {
        console.log('⚠️ API returned no records');
        return [];
      }

      const ccas = response.data.result.records || [];

      const processedCcas = ccas.length > 0 
        ? ccas.map((cca, index) => ({
            id: index + 1,
            school_name: cca.School_name, // ✅ FIX: Capital S in API response
            school_section: cca.school_section,
            category: cca.cca_grouping_desc,
            cca_name: cca.cca_generic_name,
            cca_customized_name: cca.cca_customized_name
          }))
        : [];

      console.log(`✅ getCCAData returning ${processedCcas.length} records`);
      return processedCcas;
      
    } catch (error) {
      console.error("❌ Error in getCCAData:", error.message);
      
      // Instead of throwing an error that crashes the entire /api/schools route,
      // return empty array so other data can still be fetched
      console.log('⚠️ Returning empty array due to CCA fetch error');
      return [];
    }
  }
  

module.exports = getCCAData;

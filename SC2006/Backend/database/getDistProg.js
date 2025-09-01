
const axios = require('axios');

const distProg = "d_db1faeea02c646fa3abccfa5aba99214"
const url = "https://data.gov.sg/api/action/datastore_search?resource_id="  + distProg; 

// Function to get data from the API
async function getDistProgData(queryParams) {
    try {
      console.log('🔍 getDistProgData called with:', queryParams);
      
      // Handle empty/undefined queries
      if (!queryParams || typeof queryParams !== 'string' || queryParams.trim().length === 0) {
        console.log('⚠️ Empty query parameter for distProg, returning empty array');
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
        console.log('⚠️ DistProg API returned no records');
        return [];
      }
  
      const distprogs = response.data.result.records || [];
  
      const processedDistProgs = distprogs.length > 0
        ? distprogs.map((distprog, index) => ({
            id: index + 1,
            school_name: distprog.school_name,
            category: distprog.alp_domain,
            prog_name: distprog.alp_title,
            category_1: distprog.llp_domain1,
            prog_name_1: distprog.llp_title1,
          }))
        : [];

      console.log(`✅ getDistProgData returning ${processedDistProgs.length} records`);
      return processedDistProgs;
      
    } catch (error) {
      console.error("❌ Error in getDistProgData:", error.message);
      // Return empty array instead of throwing
      console.log('⚠️ Returning empty array due to distProg fetch error');
      return [];
    }
  }
  

module.exports = getDistProgData;

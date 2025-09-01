// backend/database/getSchools.js
const axios = require('axios');
const getCoordsForAddress = require('../database/location');

const datasetId = {
  "genInfo": "d_688b934f82c1059ed0a6993d2a829089",  // General Information of Schools
};
const baseUrl = 'https://data.gov.sg/api/action/datastore_search?resource_id=' + datasetId["genInfo"];

// Function to get data from the API with improved partial matching
async function getSchoolData(queryParams) {
    try {
      console.log('🔍 getSchoolData called with:', queryParams);
      
      // Handle name-based search with partial matching
      if (queryParams.name && queryParams.name.trim().length >= 2) {
        const searchTerm = queryParams.name.trim();
        
        // Use direct query parameter for partial matching instead of exact JSON match
        // This allows searching for "admi" to find "admiralty" schools
        const partialSearchUrl = `${baseUrl}&q=${encodeURIComponent(searchTerm)}`;
        console.log('🌐 Using partial search URL:', partialSearchUrl);
        
        const response = await axios.get(partialSearchUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'School4U-App/1.0'
          }
        });
        
        console.log('✅ Schools API response status:', response.status);
        
        if (!response.data || !response.data.result || !response.data.result.records) {
          console.log('⚠️ Schools API returned no records');
          return [];
        }
        
        const schools = response.data.result.records || [];
        console.log(`📊 Found ${schools.length} schools`);
        
        // Process and return school data
        const processedSchools = schools.map((school, index) => ({
          id: index + 1,
          school_name: school.school_name || 'Unknown School',
          url_address: school.url_address || '',
          address: school.address || '',
          postal_code: school.postal_code || '',
          phone_no: school.phone_no || '',
          email_address: school.email_address || '',
          moe_programme_desc: school.moe_programme_desc || '',
          mainlevel_code: school.mainlevel_code || '',
          type_code: school.type_code || '',
          nature_code: school.nature_code || '',
          session_code: school.session_code || '',
          zone_code: school.zone_code || '',
          cluster_code: school.cluster_code || '',
          dgp_code: school.dgp_code || '',
          sap_ind: school.sap_ind || ''
        }));

        // Apply sorting if specified
        if (queryParams.sort) {
          processedSchools.sort((a, b) => {
            switch (queryParams.sort) {
              case 'name-asc':
                return a.school_name.localeCompare(b.school_name);
              case 'name-desc':
                return b.school_name.localeCompare(a.school_name);
              default:
                return 0;
            }
          });
        }

        console.log(`✅ getSchoolData returning ${processedSchools.length} records`);
        return processedSchools;
      }
      
      // Fallback to structured query for other filters (level, location)
      const queryObject = {};
      
      if (queryParams.level && queryParams.level.trim().length > 0) {
        queryObject.mainlevel_code = queryParams.level.trim();
      }
      if (queryParams.location && queryParams.location.trim().length > 0) {
        queryObject.zone_code = queryParams.location.trim();
      }
      
      const queryString = JSON.stringify(queryObject);
      const fullUrl = `${baseUrl}&q=${queryString}`;
      
      console.log('🌐 School API query:', queryString);
      console.log('🌐 Full URL:', fullUrl);
      
      const response = await axios.get(fullUrl, {
        timeout: 15000, // 15 second timeout for schools API
        headers: {
          'User-Agent': 'School4U-App/1.0'
        }
      });
      
      console.log('✅ Schools API response status:', response.status);
      
      // Handle cases where API returns no data
      if (!response.data || !response.data.result || !response.data.result.records) {
        console.log('⚠️ Schools API returned no records');
        return [];
      }
      
      const schools = response.data.result.records || [];
      console.log(`📊 Found ${schools.length} schools`);
      
      // Process school data
      const processedSchools = schools.map((school, index) => ({
        id: index + 1,
        school_name: school.school_name || 'Unknown School',
        url_address: school.url_address || '',
        address: school.address || '',
        postal_code: school.postal_code || '',
      }));

      // Apply sorting if specified
      if (queryParams.sort === "name-desc") {
        processedSchools.sort((a, b) => b.school_name.localeCompare(a.school_name));
      } else if (queryParams.sort === "name-asc") {
        processedSchools.sort((a, b) => a.school_name.localeCompare(b.school_name));
      }

      console.log(`✅ getSchoolData returning ${processedSchools.length} records`);
      return processedSchools;
      
    } catch (error) {
      console.error("❌ Error in getSchoolData:", error.message);
      
      // Return empty array instead of throwing to prevent entire API failure
      console.log('⚠️ Returning empty array due to school fetch error');
      return [];
    } 
  }
  

module.exports = getSchoolData;

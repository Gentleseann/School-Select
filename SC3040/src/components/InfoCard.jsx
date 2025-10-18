import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewCard from './ReviewCard';

const labelClass = "m-4 text-white border-sky-800 p-2 rounded-2xl bg-sky-800 my-4";
const subLabel = "font-bold float-left my-3";
const ccaInfo = "mx-8";
const subjectsInfo = "list-decimal text-left";
const linkButton = "my-2 text-white border-blue-900 p-2 rounded-2xl hover:shadow-2xl transition-shadow duration-300"
// Reusable button component with props for title and content
const InfoCard = ({schoolname}) => {
  const [ccas, setCCAs] = useState([]);
  const [distProgs, setDistProg] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showExpanded, setShowExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(()=>{
  fetchSchoolData();
},[schoolname]) // Add schoolname as dependency

const handleClose = () => {
  setShowExpanded(false);
};

const fetchSchoolData = async () => {
  try {
    setLoading(true);
    setError('');
    
    console.log('🔍 InfoCard fetching data for school:', schoolname);
    
    const queryParams = new URLSearchParams({
      query: schoolname,
    });

    const response = await axios.get(
      `http://localhost:5001/api/schools?${queryParams.toString()}`
    );

    if (response.status === 200) {
      const { ccas, moeprog, subjects, distProgs } = response.data;
      
      console.log('📊 InfoCard received data:', {
        ccas: ccas?.length,
        moeprog: moeprog?.length,
        subjects: subjects?.length,
        distProgs: distProgs?.length
      });

      // IMPORTANT: Filter data to match EXACT school name
      const schoolSpecificCCAs = (ccas || []).filter(cca => 
        cca.school_name === schoolname
      );
      
      const schoolSpecificMOEProgs = (moeprog || []).filter(prog => 
        prog.school_name === schoolname
      );
      
      const schoolSpecificDistProgs = (distProgs || []).filter(prog => 
        prog.school_name === schoolname
      );
      
      const schoolSpecificSubjects = (subjects || []).filter(subject => 
        subject.school_name === schoolname ||
        subject.school_name?.toLowerCase().includes(schoolname.toLowerCase())
      );

      console.log('🎯 InfoCard filtered for school:', schoolname, {
        ccas: schoolSpecificCCAs.length,
        moeprog: schoolSpecificMOEProgs.length,
        distProgs: schoolSpecificDistProgs.length,
        subjects: schoolSpecificSubjects.length
      });

      // Filter unique CCAs by category (the actual activity name)
      const uniqueCCAsSet = new Set();
      const filteredCCAs = schoolSpecificCCAs.filter((cca) => {
        if (!uniqueCCAsSet.has(cca.category)) {
          uniqueCCAsSet.add(cca.category);
          return true;
        }
        return false;
      });

      // Filter unique MOE Programs (use category field)
      const uniqueProgsSet = new Set();
      const filteredProgs = schoolSpecificMOEProgs.filter((prog) => {
        const progName = prog.category || prog.prog_name || prog.program_name;
        if (progName && !uniqueProgsSet.has(progName)) {
          uniqueProgsSet.add(progName);
          return true;
        }
        return false;
      });

      // Filter unique District Programs  
      const uniqueDistProgsSet = new Set();
      const filteredDistProgs = schoolSpecificDistProgs.filter((prog) => {
        const progName = prog.prog_name || prog.program_name || prog.category;
        if (progName && !uniqueDistProgsSet.has(progName)) {
          uniqueDistProgsSet.add(progName);
          return true;
        }
        return false;
      });

      // Filter unique Subjects
      const uniqueSubjectsSet = new Set();
      const filteredSubjects = schoolSpecificSubjects.filter((subject) => {
        const subjectKey = subject.category || subject.name || subject.subject_name;
        if (subjectKey && !uniqueSubjectsSet.has(subjectKey)) {
          uniqueSubjectsSet.add(subjectKey);
          return true;
        }
        return false;
      });

      // Set state with unique values (prioritize MOE programs like SchoolCard does)
      setCCAs(filteredCCAs);
      setDistProg(filteredProgs.length > 0 ? filteredProgs : filteredDistProgs); // Use MOE programs if available, fallback to district programs
      setSubjects(filteredSubjects);

      console.log("✅ InfoCard final filtered data:", {
        ccas: filteredCCAs.length,
        moePrograms: filteredProgs.length,
        distPrograms: filteredDistProgs.length,
        finalPrograms: (filteredProgs.length > 0 ? filteredProgs : filteredDistProgs).length,
        subjects: filteredSubjects.length
      });
    } else {
      setError(`Failed to fetch school details: ${response.status}`);
      console.error("Failed to fetch school details.");
    }
  } catch (error) {
    setError(`Error fetching data: ${error.message}`);
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};


  const navigate = useNavigate();
  
  // Show loading state
  if (loading) {
    return (
      <div className="mb-6">
        <div style={{width: '28rem'}} className="bg-[#FAEDCE] -mt-2 mb-5 p-6 border-2 border-black rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center underline">{schoolname}</h2>
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-800 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading school data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mb-6">
        <div style={{width: '28rem'}} className="bg-[#FAEDCE] -mt-2 mb-5 p-6 border-2 border-black rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center underline">{schoolname}</h2>
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">❌ {error}</p>
              <button 
                onClick={fetchSchoolData}
                className="px-4 py-2 bg-sky-800 text-white rounded hover:bg-sky-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div style={{width: '28rem'}} className="bg-[#FAEDCE] -mt-2 mb-5 p-6 border-2 border-black rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-bold mb-4 text-center underline">{schoolname}</h2>
        <div className="flex flex-col items-center flex-grow">
          
          {/* CCAs Section */}
          <div className={labelClass}>CCAs</div>
          <div className="flex flex-col w-full">
            <h2 className={subLabel}>1. Sports and Physical Activities:</h2>
              <div className={ccaInfo}>{ccas
    .filter((cca) => cca.cca_name === "PHYSICAL SPORTS")
    .map((cca) => cca.category)
    .join(", ") || "None available"}</div>
            <h2 className={subLabel}>2. Performing Arts:</h2>
              <div className={ccaInfo}> {ccas
    .filter((cca) => cca.cca_name === "VISUAL AND PERFORMING ARTS")
    .map((cca) => cca.category)
    .join(", ") || "None available"}</div>
            <h2 className={subLabel}>3. Clubs & Societies:</h2>
              <div className={ccaInfo}> {ccas
    .filter((cca) => cca.cca_name === "CLUBS AND SOCIETIES")
    .map((cca) => cca.category)
    .join(", ") || "None available"}</div>
            <h2 className={subLabel}>4. Uniform Groups:</h2>
              <div className={ccaInfo}> {ccas
    .filter((cca) => cca.cca_name === "UNIFORMED GROUPS")
    .map((cca) => cca.category)
    .join(", ") || "None available"}</div>
              <h2 className={subLabel}>5. Others:</h2>
              <div className={ccaInfo}> {ccas
    .filter((cca) => cca.cca_name === "OTHERS")
    .map((cca) => cca.category)
    .join(", ") || "None available"}</div>
          </div>
        
          {/* Subjects Section */}
          <div className={labelClass}>Subjects</div>
          <div className="w-full text-left">
            {subjects.length > 0 ? (
              <ol className={subjectsInfo}>
                {subjects.map((subject, index) => (
                  <li className="my-2 mx-5" key={subject.category || index}>
                    {subject.category || subject.name || subject.subject_name}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center text-gray-600 my-4">No subjects data available</div>
            )}
          </div>
          
          {/* Programs Section - NEW */}
          <div className={labelClass}>Programs</div>
          <div className="w-full text-left">
            {distProgs.length > 0 ? (
              <ol className={subjectsInfo}>
                {distProgs.map((prog, index) => (
                  <li className="my-2 mx-5" key={index}>
                    <div className="font-medium">
                      {prog.category || prog.prog_name || prog.program_name}
                    </div>
                    {prog.category_1 && (
                      <div className="text-sm text-gray-600 ml-2">
                        Type: {prog.category_1}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center text-gray-600 my-4">No programs data available</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
                  <button className={`${linkButton} bg-rose-500 w-60`} onClick={()=> navigate('/chat')}>Chat with the community</button>
                  <button
  className={`${linkButton} bg-green-800 w-60`}
  onClick={() => setShowExpanded(true)} // Use an arrow function here
>
  View Reviews
</button>

      </div>
      <div>
      {showExpanded && (
          <ReviewCard
            name={schoolname}
            onClose={handleClose}
          />
      )}
      </div>
    </div>
  );
};

export default InfoCard;
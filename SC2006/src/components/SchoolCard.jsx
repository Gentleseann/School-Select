import { useNavigate } from "react-router-dom";
import DetailedCard from "./DetailedCard";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const SchoolCard = ({ name, postal_code, location, onCompare }) => {
  const navigate = useNavigate();
  const [showExpanded, setShowExpanded] = useState(false);
  const [ccas, setCCAs] = useState([]);
  const [distProgs, setDistProg] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loggedIn } = useAuth(); // Authentication context

  // Fetch school data based on the school name
  const fetchSchoolData = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({ query: name });
      const response = await axios.get(
        `http://localhost:5001/api/schools?${queryParams.toString()}`
      );

      if (response.status === 200) {
        const { ccas, moeprog, subjects } = response.data;
        
        // Filter CCAs for this specific school (like InfoCard does)
        const schoolSpecificCCAs = (ccas || []).filter(cca => 
          cca.school_name === name
        );
        
        // Filter MOE programs for this specific school  
        const schoolSpecificProgs = (moeprog || []).filter(prog => 
          prog.school_name === name
        );
        
        // Filter subjects for this specific school
        const schoolSpecificSubjects = (subjects || []).filter(subject => 
          subject.school_name === name
        );
        
        console.log(`🔍 SchoolCard filtering for "${name}":`, {
          totalCCAs: ccas?.length || 0,
          filteredCCAs: schoolSpecificCCAs.length,
          totalProgs: moeprog?.length || 0, 
          filteredProgs: schoolSpecificProgs.length,
          totalSubjects: subjects?.length || 0,
          filteredSubjects: schoolSpecificSubjects.length
        });
        
        setCCAs(schoolSpecificCCAs);
        setDistProg(schoolSpecificProgs);
        setSubjects(schoolSpecificSubjects);
      } else {
        console.error("Failed to fetch school details.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setShowExpanded(true);
    }
  };

  // Handle adding a school to favorites
  const handleAddSchool = async (schData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/addToFav`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: schData }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success YAYYYYY");
        alert(result.message); // Display success message
      } else {
        alert(result.message || result.error); // Display error message from the backend
      }
    } catch (error) {
      console.error("Runtime error: ", error);
      alert("A network error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-4 bg-[#FAEDCE] border border-black shadow-md rounded-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-700">Postal Code: {postal_code}</p>
        <p className="text-gray-700">Location: {location}</p>
      </div>

      <div className="space-x-2">
        {/* See Details Button */}
        <button
          onClick={fetchSchoolData}
          className="bg-blue text-white px-4 py-2 rounded-md shadow-lg transition transform hover:scale-105 active:scale-95 hover:bg-[#1A237E]"
        >
          See Details
        </button>

        {/* Add to Compare Button */}
        <button
          onClick={() => handleAddSchool(name)}
          className="bg-[#EF5A6F] text-white px-4 py-2 rounded-md shadow-lg transition transform hover:scale-105 active:scale-95 hover:bg-[#CC4A5E]"
        >
          Add to Compare
        </button>

        {/* Review Button (Green color) */}
        {loggedIn ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/school-review", { state: { name } });
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition transform hover:scale-105 active:scale-95 hover:bg-green-600"
          >
            Review
          </button>
        ) : (
          <div className="text-gray-500 text-sm">Login to add reviews</div>
        )}
      </div>

      {/* Render DetailedCard only if showExpanded is true */}
      {showExpanded && (
        <DetailedCard
          name={name}
          ccas={ccas}
          programmes={distProgs}
          subjects={subjects}
          location={location}
          onClose={() => setShowExpanded(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SchoolCard;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/InfoCard';
import NameCard from '../components/NameCard';
import { useAuth } from '../context/AuthContext.jsx';

const ComparisonDashboard = () => {
  const { loggedIn, setLoggedIn } = useAuth()
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownRef = useRef(null);

{/*User Schools - 🔧 FIX: Initialize as empty array with proper structure */}
  const [allSchools, setAllSchools] = useState([]);

{/*Save selected school for page reloading*/}
const [selectedSchools, setSelectedSchools] = useState(() => {
  const savedState = localStorage.getItem('selectedSchools');
  return savedState !==null ? JSON.parse(savedState) : [];
})

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

// 🔧 FIX: Add proper error handling and loading states
useEffect(()=>{
  fetchUserSchools();
},[])

useEffect(() => {
  localStorage.setItem('selectedSchools', JSON.stringify(selectedSchools));
}, [selectedSchools]);

{/*Add and remove schools */}
const handleRemoveSchool = (schoolName) => {
  setSelectedSchools((prevSchools) =>
    prevSchools.filter((school) => school.school_name !== schoolName)
  );
};

const handleAddSchool = (school) => {
  console.log(school)
  if (
    selectedSchools.length < 3 &&
    !selectedSchools.some((s) => s.name === school.school_name)
  ) {
    setSelectedSchools([...selectedSchools, school]);
  }
};

const RemoveFavSchool = async(schoolName) =>{
  try {
    const response = await fetch("http://localhost:5001/api/deleteFav",{method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ school_name: schoolName })})
      console.log("sent")
    
  } catch (error) {
    console.log("runtime error")
  }
}

// 🔧 FIX: Enhanced fetchUserSchools with proper error handling
const fetchUserSchools = async()=>{
  try {
    setLoading(true);
    setError('');
    console.log('🔍 Fetching user favorites...');
    
    const response = await fetch("http://localhost:5001/api/fetchFav", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok){
      const data = await response.json();
      console.log("✅ Fetched favorites successfully:", data);
      
      // 🔧 FIX: Handle the new response format from backend
      const schools = data.favorites || data || [];
      setAllSchools(Array.isArray(schools) ? schools : []);
      console.log("📋 Stored schools:", schools);
    }
    else{
      const errorData = await response.text();
      console.error("❌ Response error:", response.status, errorData);
      setError(`Failed to fetch favorites: ${response.status}`);
      setAllSchools([]); // Set empty array on error
    }
    
  } catch (error) {
    console.error("❌ Network error fetching favorites:", error);
    setError(`Network error: ${error.message}`);
    setAllSchools([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
}


return ( 
  
!loggedIn ? <div className="flex justify-center items-center h-[75vh]">Please Login first</div> :
    <div className="-mt-3 min-h-screen bg-gray-100 p-0">
      {/* navigation bar*/}
      <div className="flex justify-between p-2 left-0 bg-[#EF5A6F] shadow-md z-40">
        <div className="contentLeft">
          <div className="p-2 nameBar flex flex-grow border-r bg-[#FAEDCE] h-10 ml-7 mt-3 rounded-xl justify-between">
            {selectedSchools.length > 0 ? null : (<p className="mx-5 opacity-50 mr-40">View your list</p>)}
            {Array.from({ length: selectedSchools.length }).map((_, i) => (
              <NameCard key={i} schoolData={selectedSchools[i]} onRemove={handleRemoveSchool} />
            ))}
            {selectedSchools.length < 3 ?(
            <div className="flex justify-center items-center h-full px-2">
              <button className="bg-[#536493] text-white h-10 rounded-xl p-1 px-3 -mr-5" onClick={()  =>{navigate("/search")}}>Add School</button>
            </div>
            ) : null}
          </div>                         
          <p className="text-base mx-9 my-1 float-left "> Displaying {selectedSchools.length} {selectedSchools.length>1 ? "schools" : "school"}. (Max 3)</p> 
        </div>
        <div className="testButton">
        <div className="relative">
<button
  onClick={toggleDropdown}
  className="rounded-lg border-black border-2 mx-5 px-3 hover:opacity-50 mt-4 bg-[#FAEDCE]"
>
  View your favourited schools
</button>

  {isDropdownOpen && (
    <div
      ref={dropdownRef}
      className="absolute bg-white border mt-2 rounded shadow-lg max-h-60 overflow-y-auto z-50"
      style={{ width: '250px' }}
    >
      {/* 🔧 FIX: Add loading and error states */}
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          Loading favorites...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          {error}
          <button 
            onClick={fetchUserSchools}
            className="block mt-2 text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <ul>
          {/* 🔧 FIX: Safe array handling with fallback */}
          {(allSchools && Array.isArray(allSchools) && allSchools.length > 0) ? (
            allSchools.map((school) => (
              <li
                key={school.id || school.school_name}
                className="flex justify-between items-center p-2 hover:bg-gray-100 border-b"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {school.school_name || 'Unknown School'}
                  </div>
                  {school.review && (
                    <div className="text-xs text-gray-500 mt-1">
                      ⭐ {school.rating_f || 'N/A'}/5 | {school.review.substring(0, 30)}...
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {selectedSchools.some((s) => s.school_name === school.school_name) ? (
                    <button
                      onClick={() => handleRemoveSchool(school.school_name)}
                      className="text-red-500 text-xs px-2 py-1 hover:bg-red-100 rounded"
                      title="Remove from comparison"
                    >
                      Remove
                    </button>
                  ) : selectedSchools.length < 3 ? (
                    <button
                      onClick={() => handleAddSchool(school)}
                      className="text-blue-500 text-xs px-2 py-1 hover:bg-blue-100 rounded"
                      title="Add to comparison"
                    >
                      Add
                    </button>
                  ) : null}
                  
                  <button
                    onClick={() => {
                      RemoveFavSchool(school);
                      setAllSchools((prev) => 
                        (prev || []).filter((s) => s.id !== school.id)
                      );
                    }}
                    className="text-red-600 text-xs px-2 py-1 hover:bg-red-100 rounded"
                    title="Delete from favorites"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No favorite schools yet.
              <br />
              <button 
                onClick={() => navigate("/search")}
                className="mt-2 text-blue-500 hover:underline"
              >
                Find schools to add
              </button>
            </div>
          )}
        </ul>
      )}
    </div>
  )}
</div>

     </div>
      </div> 
      
      <div className="Container ">
         {/* Add comparison tables/cards here */}
        {selectedSchools.length > 0 ? 
        (<div className="flex flex-wrap items-start justify-center mt-12 space-x-8">
          {Array.from({ length: selectedSchools.length }).map((_, i) => (
          <InfoCard key={i} schoolname={selectedSchools[i].school_name}/>
        ))}
        </div>) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-center">No Schools in Comparison Dashboard</p>
          </div>

        )}
      </div>  
    </div>
  );
};

export default ComparisonDashboard;
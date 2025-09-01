import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SchoolCard from "../components/SchoolCard";
import axios from "axios";

const SearchSchools = () => {
  const navigate = useNavigate();

  // State management
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [ccas, setCCAs] = useState([]);
  const [distProgs, setdistProg] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [moeprog, setMOEProg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination and infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Filter-related state
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [level, setLevel] = useState("");
  const [programme, setProgramme] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const SCHOOLS_PER_PAGE = 10;

  const fetchSchools = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        query,
        level,
        programme,
        location,
        sortBy,
        page,
        limit: SCHOOLS_PER_PAGE,
      });

      // Fetch data from the server
      const response = await axios.get(
        `http://localhost:5001/api/schools?${queryParams.toString()}`
      );
      console.log("Query Parameters:", queryParams.toString());

      // Ensure response is successful
      if (response.status !== 200) {
        throw new Error("Failed to fetch schools.");
      }

      // Parse and set school and CCA data from response
      const { schools, ccas, distProgs, subjects, moeprog } = response.data;
      setResults((prevResults) =>
        reset ? schools : [...prevResults, ...schools]
      );
      setCCAs(ccas);
      setdistProg(distProgs);
      setSubjects(subjects);
      setMOEProg(moeprog);
      setHasMore(schools.length === SCHOOLS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch schools. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Reset results and fetch on initial mount and whenever filters or query change
  useEffect(() => {
    setPage(1);
    fetchSchools(true);
  }, [query, level, programme, location, sortBy]);

  // Fetch more schools when the page number changes
  useEffect(() => {
    if (page > 1) fetchSchools();
  }, [page]);

  // IntersectionObserver to detect when the bottom is reached
  const lastSchoolRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleClear = () => {
    setQuery("");
    setLevel("");
    setProgramme("");
    setLocation("");
    setSortBy("name-asc");
    fetchSchools(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-8">
        {/* Secondary Navbar - Filters */}
        <div className="flex items-center space-x-4 bg-[#EF5A6F] p-4 rounded-md mb-4 text-black">
          <input
            type="text"
            placeholder="Search your school"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 border border-black rounded-md bg-[#FAEDCE]"
          />
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="bg-blue text-white px-4 py-2 rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-[#1A237E] active:scale-95"
          >
            {filtersVisible ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            onClick={() => fetchSchools(true)}
            disabled={loading}
            className={`bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-green-600 active:scale-95 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 px-4 py-2 rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-gray-400 active:scale-95"
          >
            Clear
          </button>

          {/* Sorted by Dropdown aligned to the right */}
          <div className="ml-auto flex items-center space-x-2">
            <label className="text-black">Sorted by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-md bg-[#FAEDCE]"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Toggleable Filters Section */}
        {filtersVisible && (
          <div className="flex flex-col space-y-4 mb-4 p-4 bg-[#EF5A6F] rounded-md">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Level (Primary, Secondary, Junior College)"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="flex-1 p-2 border border-black rounded-md bg-[#FAEDCE]"
              />
              <input
                type="text"
                placeholder="Location (North, South, East, West)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 p-2 border border-black rounded-md bg-[#FAEDCE]"
              />
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && <p className="text-center">Loading schools...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Display Search Results */}
        <div className="grid gap-4">
          {results.map((school, index) => (
            <div
              ref={index === results.length - 1 ? lastSchoolRef : null}
              key={school.id}
            >
              <SchoolCard
                name={school.school_name}
                postal_code={school.postal_code}
                location={school.address}
                onClick={() => !loading && navigate(`/school/${school.id}`)}
                onCompare={() =>
                  console.log(`Added ${school.school_name} to compare`)
                }
                onReview={() => console.log(`Reviewing ${school.school_name}`)}
              />
            </div>
          ))}
        </div>

        {/* No Results Found */}
        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500">No schools found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchSchools;

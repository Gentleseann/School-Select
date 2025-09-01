import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import axios from "axios";
import marker from "../assets/marker.png";

const DetailedCard = ({
  name,
  ccas = [],
  subjects = [],
  programmes = [],
  location,
  onClose,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("CCAs");
  const [coordinates, setCoordinates] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false); // State to manage InfoWindow display

  
  console.log("Name:", name);
  console.log("CCAs:", ccas);
  console.log("Subjects:", subjects);
  console.log("DistProgs:", programmes);
  console.log("Location:", location);
  console.log("Loading:", loading);

  // Fetch coordinates based on the address
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5001/api/get-coordinates",
          {
            address: location,
          }
        );
        setCoordinates(response.data);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (location) fetchCoordinates();
  }, [location]);

  const renderContent = () => {
    if (loading) return <p>Loading data...</p>;

    switch (activeTab) {
      case "CCAs":
        console.log("🔍 CCA Debug Info:");
        console.log("- School name from props:", name);
        console.log("- Total CCAs in dataset:", ccas.length);
        console.log("- Sample CCA school names:", ccas.slice(0, 5).map(cca => cca.school_name));
        console.log("- First few CCAs with their school names:", ccas.slice(0, 5).map(cca => ({name: cca.school_name, cca: cca.cca_name})));
        
        const matchingCCAs = ccas.filter((cca) => {
          const match = cca.school_name === name;
          if (ccas.length > 0 && ccas.length < 10) {
            console.log(`- Comparing "${cca.school_name}" === "${name}": ${match}`);
          }
          return match;
        });
        console.log("- Matching CCAs found:", matchingCCAs.length);
        
        // Use category (actual CCA activity) instead of cca_name (generic group)
        const uniqueCCAs = Array.from(
          new Set(
            matchingCCAs.map((cca) => cca.category)
          )
        );
        
        console.log("- Unique CCA categories (activities):", uniqueCCAs);
        
        return (
          <ul className="list-disc list-inside max-h-56 overflow-y-auto pr-2">
            {uniqueCCAs.length > 0 ? (
              uniqueCCAs.map((cca, index) => <li key={index}>{cca}</li>)
            ) : (
              <li>No CCAs available for this school. (Total CCAs in dataset: {ccas.length})</li>
            )}
          </ul>
        );

      case "Subjects":
        const uniqueSubjects = Array.from(
          new Set(
            subjects
              .filter((subject) => subject.school_name === name)
              .map((subject) => subject.category)
          )
        );
        return (
          <ul className="list-disc list-inside max-h-56 overflow-y-auto pr-2">
            {uniqueSubjects.length > 0 ? (
              uniqueSubjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))
            ) : (
              <li>No subjects available for this school.</li>
            )}
          </ul>
        );

      case "Programmes":
        const uniqueProgrammes = Array.from(
          new Set(
            programmes
              .filter((programme) => programme.school_name === name)
              .map((programme) => programme.category)
          )
        );
        return (
          <ul className="list-disc list-inside max-h-56 overflow-y-auto pr-2">
            {uniqueProgrammes.length > 0 ? (
              uniqueProgrammes.map((programme, index) => (
                <li key={index}>{programme}</li>
              ))
            ) : (
              <li>No programmes available for this school.</li>
            )}
          </ul>
        );

      case "Locations":
        if (!coordinates) return <p>Location information not available.</p>;

        return (
          <APIProvider apiKey="AIzaSyBSL1FdwBDJ5SbXDOpdguvatCAg5gZ6SJM">
            <div className="w-full h-80">
              <Map zoom={15} center={coordinates} mapId="DEMO_MAP_ID">
                <AdvancedMarker
                  position={coordinates}
                  onClick={() => setShowInfoWindow(true)}
                />
                {showInfoWindow && (
                  <InfoWindow
                    position={coordinates}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div>
                      <p>
                        <strong>School Name:</strong> {name}
                      </p>
                      <p>
                        <strong>Address:</strong> {location}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </div>
          </APIProvider>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FAEDCE] p-6 w-[90%] max-w-3xl max-h-[95vh] rounded-lg shadow-lg relative overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-black transition"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-4">{name}</h2>

        {/* Tabs */}
        <div className="flex justify-between mb-4 pb-2">
          {["CCAs", "Subjects", "Programmes", "Locations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 font-semibold rounded-t-md transition-transform transform hover:scale-105 hover:bg-[#EF5A6F] ${
                activeTab === tab
                  ? "bg-[#EF5A6F] text-white"
                  : "bg-[#BF9D8C] text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content with Small Scrollable Area */}
        <div className="text-gray-700 max-h-80 overflow-y-auto p-4 bg-[#FAEDCE]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailedCard;

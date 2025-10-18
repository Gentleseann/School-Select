import React, { useState, useEffect } from "react";
import { FaLink, FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const ChatComponent = ({
  title,
  imageSrc,
  apiEndpoint,
  schoolFilter,
  placeholder,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolList, setSchoolList] = useState([]);
  const [error, setError] = useState(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  const fetchSchoolData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5001/api/schools?query=${schoolSearch}`
      );

      if (response.status === 200) {
        const filteredSchools = response.data.schools.filter(schoolFilter);
        setSchoolList(filteredSchools);
        console.log(filteredSchools)
      } else {
        throw new Error("Failed to fetch schools.");
      }
    } catch (error) {
      setError("Could not fetch schools.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolData();
  }, [schoolSearch]);

  useEffect(() => {
    if (searchTerm) {
      const results = messages
        .map((msg, index) => ({ ...msg, index }))
        .filter((msg) =>
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      setSearchResults(results);
      setCurrentSearchIndex(0);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, messages]);

  useEffect(() => {
    if (selectedSchool && !searchTerm) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/api/${apiEndpoint}/${selectedSchool}`
          );
          const data = await response.json();
          setMessages(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };

      fetchMessages();
      // 🚀 PERFORMANCE FIX: Reduced from 2s to 30s polling
      // Consider using WebSockets or Supabase real-time subscriptions for better performance
      const intervalId = setInterval(fetchMessages, 30000); // 30 seconds instead of 2
      return () => clearInterval(intervalId);
    }
  }, [selectedSchool, searchTerm, apiEndpoint]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/${apiEndpoint}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: newMessage,
              school_id: selectedSchool,
            }),
            credentials:"include"
          }
        );

        if (response.ok) {
          const result = await response.json();
          setMessages((prevMessages) => [...prevMessages, result]);
          setNewMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSearchNavigation = (direction) => {
    let newIndex = currentSearchIndex;
    if (direction === "up" && currentSearchIndex > 0) newIndex--;
    else if (
      direction === "down" &&
      currentSearchIndex < searchResults.length - 1
    )
      newIndex++;

    if (newIndex !== currentSearchIndex) {
      setCurrentSearchIndex(newIndex);
      document
        .getElementById(`message-${searchResults[newIndex].index}`)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formattedDate = (createdAt) => {
    const date = new Date(createdAt);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
        <h3 className="text-lg font-bold mb-4">Select School</h3>
        <input
          type="text"
          placeholder="Search your school"
          className="w-full p-2 mb-4 bg-yellow border border-black rounded-full"
          value={schoolSearch}
          onChange={(e) => setSchoolSearch(e.target.value)}
        />
        <div className="overflow-auto h-96">
          {Array.isArray(schoolList) &&
            schoolList.map((school) => (
              <button
                name={school.school_name}
                key={school.postal_code}
                onClick={() => setSelectedSchool(school.postal_code)}
                className={`block w-full text-left p-2 rounded-lg mb-2 ${
                  selectedSchool === school.postal_code
                    ? "bg-blue text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {school.school_name}
              </button>
            ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex flex-col flex-grow h-full bg-[#FFF1DB]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 p-4 bg-[#B49284] flex justify-between items-center border-b border-gray-300 shadow-md">
          <div className="flex items-center">
            <img
              src={imageSrc}
              alt="Group"
              className="w-12 h-12 rounded-full mr-3"
            />
            <h2 className="text-2xl font-bold text-black">{title}</h2>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search messages"
              className="w-50 p-2 bg-[#FAEDCE] border border-gray-400 rounded-full focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 ? (
              <div className="flex space-x-2 items-center">
                <span>{`${currentSearchIndex + 1} of ${
                  searchResults.length
                }`}</span>
                <button
                  className="p-2 bg-gray-200 rounded-full"
                  onClick={() => handleSearchNavigation("up")}
                  disabled={currentSearchIndex === 0}
                >
                  <FaArrowUp />
                </button>
                <button
                  className="p-2 bg-gray-200 rounded-full"
                  onClick={() => handleSearchNavigation("down")}
                  disabled={currentSearchIndex === searchResults.length - 1}
                >
                  <FaArrowDown />
                </button>
              </div>
            ) : searchTerm ? (
              <span className="text-black font-semibold ml-2">
                Message not found
              </span>
            ) : null}
          </div>
        </div>

        {/* Messages Section */}
        <div className="p-6 flex-grow overflow-auto bg-[#FFF9EF]">
          {loading ? (
            <div>Loading chat messages...</div>
          ) : (
            messages.map((msg, index) => {
              // ✅ FIX: Parse username from message since backend stores it as "username: message"
              const parseMessage = (messageText) => {
                if (!messageText) return { username: "Unknown", message: "" };
                
                // Check if message contains ": " to separate username from message
                const colonIndex = messageText.indexOf(': ');
                if (colonIndex > 0) {
                  const username = messageText.substring(0, colonIndex);
                  const message = messageText.substring(colonIndex + 2);
                  return { username, message };
                } else {
                  // Fallback for messages without username format
                  return { username: "Unknown", message: messageText };
                }
              };

              const { username, message } = parseMessage(msg.message);

              return (
                <div
                  key={index}
                  id={`message-${index}`}
                  className={`mb-4 p-3 rounded-xl shadow-sm max-w-md ${
                    searchResults.some((result) => result.index === index)
                      ? "bg-[#FAD02E]"
                      : "bg-white"
                  } ${
                    searchResults[currentSearchIndex]?.index === index
                      ? "border-2 border-blue"
                      : ""
                  } ${msg.user === "self" ? "ml-auto bg-[#DAEAF1]" : "mr-auto bg-[#FAF3EB]"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">
                    {formattedDate(msg.created_at)}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium text-blue-600">{username}</span>: {message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Section */}
        <div className="sticky bottom-0 bg-white border-t border-gray-300 px-4 py-3 flex items-center space-x-4 shadow-md">
          <div className="flex items-center flex-grow rounded-full border border-gray-300 bg-[#FAEDCE] px-4 py-2">
            <FaLink className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-transparent focus:outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <button
            className="px-4 py-2 bg-blue text-white rounded-full hover:scale-105 transform transition-transform duration-150 flex items-center focus:outline-none"
            onClick={handleSendMessage}
          >
            <FaPaperPlane className="mr-2" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

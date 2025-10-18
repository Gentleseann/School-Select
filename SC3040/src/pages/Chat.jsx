import React from "react";
import ButtonCardForChat from "../components/ButtonCardForChat"; // Reusable card component
import { useState, useEffect } from "react";
import psgImage from "../assets/psg-image.png";
import afterpri from "../assets/apchat.png";
import aftsec from "../assets/after-secondary.png"
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Chat = () => {

  const [isVerified, setIsVerified] = useState(false); // New state for authentication
  const[allChats, setAllChats]=useState([]);
  const location = useLocation(); //to link compare dashboard 
  const { loggedIn, setLoggedIn } = useAuth();

  useEffect(() => {

    /*
      // to link the comparison dashboard
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const schoolIdFromUrl = searchParams.get('school_id');
      
      if (schoolIdFromUrl) {
        setSelectedSchool(Number(schoolIdFromUrl));
      }
    }, [location.search]);
    
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllChats(data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
  
    
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch('/api/chat/verify-access', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token with the request
          },
        });
        const data = await response.json();
        if (data.verified) {
          setIsVerified(true); // User is verified as a parent
        }
      }
    };
    */
    
    //fetchChats();
    // checkAuthStatus(); // Check the token when the page loads
  }, []);



  return ( 
    !loggedIn ? <div className="flex justify-center items-center h-[75vh]">Please Login first</div> : 
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Parents Chat Forum</h2>
      <p className="text-lg mb-6">
        Join channel to understand the school life of your children.
      </p>
      <ul>
        {allChats.map((chat)=>(
          <li key={chat.id}>{chat.name}</li>
        ))}
      </ul>
      
      {/* Flexbox container for horizontal alignment */}
      <div className="flex space-x-6">
        {/* Card 1 */}
        <ButtonCardForChat
          title="Parents Support Group"
          imageUrl={psgImage}
          description="Ask any questions or share advice about your child's school experience."
          linkText={"Join chat"}
          linkHref={"/psgchat"} // Enable the link only if authenticated
          //onClick={isVerified } // Handle verification if not authenticated
          //blurred={!isVerified} // Blur if not verified
        />
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Your children's roadmap</h2>
        <p className="text-lg mb-6">
          Join channel to understand what to expect in the transition to their next phase of journey.
        </p>
        
        {/* Flexbox container for horizontal alignment */}
        <div className="flex space-x-6">
          {/* Card 4 */}
          <ButtonCardForChat
            title="After primary school"
            imageUrl={afterpri}
            description="Discuss with parents how to choose a secondary school after PSLE."
            linkText="Join chat"
            linkHref="/aftprichat"
          />

          {/* Card 5 */}
          <ButtonCardForChat
            title="After secondary school"
            imageUrl={aftsec}
            description="Discuss with parents where to go after secondary schools."
            linkText="Join chat"
            linkHref="/aftsecchat"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

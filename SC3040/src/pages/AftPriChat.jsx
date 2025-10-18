import React from "react";
import ChatComponent from "../components/ChatComponent";
import apImage from "../assets/apchat.png";

const AftPriChat = () => (
  <ChatComponent
    title="Journey After Primary School"
    imageSrc={apImage}
    apiEndpoint="apchat"
    schoolFilter={(school) => school.school_name.toLowerCase().includes("primary")}
    placeholder="Type a message..."
  />
);

export default AftPriChat; 

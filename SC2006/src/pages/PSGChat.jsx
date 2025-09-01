import React from "react";
import ChatComponent from "../components/ChatComponent";
import psgImage from "../assets/psg-image.png";



const PSGChat = () => (
  <ChatComponent
    title="Parents Support Group"
    imageSrc={psgImage}
    apiEndpoint="psgchat"
    schoolFilter={() => true} // No specific filter for PSGChat
    placeholder="Type a message..."
  />
);



export default PSGChat; 

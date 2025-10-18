import React from "react";
import ChatComponent from "../components/ChatComponent";
import asImage from "../assets/after-secondary.png";

const AftSecChat = () => (
  <ChatComponent
    title="Journey After Secondary School"
    imageSrc={asImage}
    apiEndpoint="aschat"
    schoolFilter={(school) => !school.school_name.toLowerCase().includes("primary")}
    placeholder="Type a message..."
  />
);


export default AftSecChat;
import React from "react";

// Reusable button component with props for title and content
const ButtonCard = ({ title, children }) => {
  return (
    <div className="w-64 h-64 bg-[#FAEDCE] p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <div className="flex justify-center items-center h-32">{children}</div>
    </div>
  );
};

export default ButtonCard;

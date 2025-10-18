const SchoolCard = ({
  name,
  programme,
  location,
  onClick,
  onCompare,
  onReview,
}) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-[#FAEDCE] border border-black shadow-md rounded-md flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div>
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-700">Special Programme: {programme}</p>
        <p className="text-gray-700">Location: {location}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from triggering
            onCompare();
          }}
          className="bg-[#EF5A6F] text-white px-4 py-2 rounded-md"
        >
          Add to compare
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from triggering
            onReview();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default SchoolCard;

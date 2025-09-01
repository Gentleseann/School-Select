import { Link } from "react-router-dom";
import ButtonCard from "../components/ButtonCard"; // Reusable card component

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6 -mt-32">
      <h1 className="text-4xl font-bold">Hello</h1>
      <p className="text-lg">What do you want to do today?</p>

      {/* Button Container */}
      <div className="flex justify-center items-center space-x-6">
        {/* Browse Schools Button */}
        <Link to="/search">
          <ButtonCard title="Browse School For Your Child">
            <img
              src="https://cdn-icons-png.flaticon.com/512/201/201818.png"
              alt="School"
              className="w-20 h-20 object-contain"
            />
          </ButtonCard>
        </Link>

        {/* Compare Schools Button */}
        <Link to="/dashboard">
          <ButtonCard title="Compare Schools">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2946/2946577.png"
              alt="Comparison"
              className="w-20 h-20 object-contain"
            />
          </ButtonCard>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext.jsx';

const LoginRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");
  const { loggedIn, setLoggedIn } = useAuth();

  useEffect(() => {
    // Update the isLogin state whenever the route changes
    setIsLogin(location.pathname === "/loginAndRegister/login");
  }, [location.pathname]);

  return (
    loggedIn ? (<div>You are already Logged in</div>) :
    <div className="min-h-screen bg-gray-100 mb-24">
      {/* Secondary Navbar positioned lower under primary navbar */}
      <div className="fixed top-32 left-0 w-full bg-[#EF5A6F] shadow-md z-40">
        <div className="flex w-full max-w-4xl mx-auto">
          <button
            className={`w-1/2 py-5 text-lg font-bold ${
              isLogin ? "bg-[#FAEDCE] text-black" : "bg-[#EF5A6F] text-white"
            }`}
            onClick={() => navigate("/loginAndRegister/login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-5 text-lg font-bold ${
              !isLogin ? "bg-[#FAEDCE] text-black" : "bg-[#EF5A6F] text-white"
            }`}
            onClick={() => navigate("/loginAndRegister/register")}
          >
            Register
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-19rem)] bg-gray-100 pt-44">
        <div
          className={`w-full ${isLogin ? "max-w-2xl p-12" : "max-w-5xl p-16"} bg-white rounded-lg shadow-lg`}
        >
          {/* Outlet renders the nested routes here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;

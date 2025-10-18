import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import HomePage from "./pages/Homepage";
import LoginRegister from "./pages/LoginRegister";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComparisonDashboard from "./pages/ComparisonDashboard";
import Chat from "./pages/Chat";
import PSGChat from "./pages/PSGChat";
import AftPriChat from "./pages/AftPriChat";
import AftSecChat from "./pages/AftSecChat";
import SearchSchools from "./pages/SearchSchools";
import DetailedCard from "./components/DetailedCard.jsx";
import Review from "./pages/Review";
import logo from "./assets/removebg.png";
import { useAuth } from "./context/AuthContext.jsx";
import SchoolReview from "./pages/SchoolReview.jsx";
import { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

const App = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const location = useLocation(); // Get current location for transitions

  const handleLogout = async () => {
    await fetch(`http://localhost:5001/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/verifySession",
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setLoggedIn(data.loggedIn);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setLoggedIn(false);
      }
    };
    verifySession();
  }, []);

  // Define fade transition for pages
  const fadeTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 }, // Control speed of the fade
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar */}
      <nav className="fixed top-0 left-0 w-full bg-[#536493] py-4 text-white shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div
            className="flex-shrink-0 bg-[#FEFAE0] p-1 rounded-full ml-[-100px]"
            style={{ width: "100px", height: "100px" }}
          >
            <img src={logo} alt="Logo" className="w-full h-full rounded-full" />
          </div>
          <ul className="flex justify-between items-center w-full pl-10 space-x-8">
            <li className="flex-grow text-center">
              <Link
                to="/"
                className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Home
              </Link>
            </li>
            <li className="flex-grow text-center">
              <Link
                to="/search"
                className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Browse Schools
              </Link>
            </li>
            <li className="flex-grow text-center">
              <Link
                to="/dashboard"
                className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Compare Schools
              </Link>
            </li>
            <li className="flex-grow text-center">
              <Link
                to="/chat"
                className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                Chat Forum
              </Link>
            </li>
            <li className="flex-grow text-center">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/loginAndRegister/login"
                  className="relative after:absolute after:content-[''] after:h-[2px] after:bg-white after:left-0 after:bottom-[-2px] after:w-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                >
                  Login / Register
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {/* Page Content */}
      <div className="pt-16"></div> {/* Adjusted padding to avoid overlap */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {/* Wrap Routes with AnimatePresence */}
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div {...fadeTransition}>
                  <HomePage />
                </motion.div>
              }
            />
            <Route
              path="/loginAndRegister"
              element={
                <motion.div {...fadeTransition}>
                  <LoginRegister />
                </motion.div>
              }
            >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <motion.div {...fadeTransition}>
                  <ComparisonDashboard />
                </motion.div>
              }
            />
            <Route
              path="/search"
              element={
                <motion.div {...fadeTransition}>
                  <SearchSchools />
                </motion.div>
              }
            />
            {/* DetailedCard rendered without AnimatePresence or motion.div */}
            <Route path="/school/:id" element={<DetailedCard />} />

            <Route
              path="/chat"
              element={
                <motion.div {...fadeTransition}>
                  <Chat />
                </motion.div>
              }
            />
            <Route
              path="/psgchat"
              element={
                <motion.div {...fadeTransition}>
                  <PSGChat />
                </motion.div>
              }
            />
            <Route
              path="/aftprichat"
              element={
                <motion.div {...fadeTransition}>
                  <AftPriChat />
                </motion.div>
              }
            />
            <Route
              path="/aftsecchat"
              element={
                <motion.div {...fadeTransition}>
                  <AftSecChat />
                </motion.div>
              }
            />
            <Route
              path="/review"
              element={
                <motion.div {...fadeTransition}>
                  <Review />
                </motion.div>
              }
            />
            <Route
              path="/school-review"
              element={
                <motion.div {...fadeTransition}>
                  <SchoolReview />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      {/* Footer */}
      <footer className="bg-[#536493] text-white py-6 text-center">
        <Link to="/review" className="hover:underline">
          Leave us a review
        </Link>{" "}
        | <span>www.rightschoolforyourkid.com</span>
      </footer>
    </div>
  );
};

export default App;

import { useState } from "react";
const Register = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    mobile: "",
    email: "",
    residence: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(signUpData.username)) {
      alert(
        "Username can only contain lowercase letters and numbers. Avoid spaces or special characters."
      );
      return;
    }

    // Password must be at least 10 characters long
    if (signUpData.password.length < 10) {
      alert("Password must be at least 10 characters long");
      return;
    }

    // Password must contain uppercase, lowercase, number, and symbol
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=?<>~]).+$/;
    if (!passwordRegex.test(signUpData.password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
          name: signUpData.name,
          mobile: signUpData.mobile,
          residence: signUpData.residence,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    console.log(signUpData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Register Form Card */}
      <div className="w-full max-w-4xl bg-white p-12 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold mb-8 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name and Mobile Number */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Name:</label>
              <input
                type="text"
                name="name"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="Full Name"
                value={signUpData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mobile Number:</label>
              <input
                type="tel"
                name="mobile"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="+65"
                value={signUpData.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email and Area of Residence */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Email:</label>
              <input
                type="email"
                name="email"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Area of Residence:
              </label>
              <input
                type="text"
                name="residence"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="Residence"
                value={signUpData.residence}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block font-medium mb-1">Username:</label>
            <input
              type="text"
              name="username"
              className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
              placeholder="Username"
              value={signUpData.username}
              onChange={handleChange}
            />
            <small className="text-gray-600">
              Your username can only contain lowercase letters and numbers.
              Avoid spaces or special characters.
            </small>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Password:</label>
              <input
                type="password"
                name="password"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleChange}
              />
              <small className="text-gray-600">
                Password must be at least 10 characters, with upper/lower case
                letters, numbers, and symbols.
              </small>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-4 border rounded bg-[#FAEDCE] focus:outline-none"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={signUpData.confirmPassword}
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-sm text-gray-600">
            We would like to keep you updated with school-related updates.
            Communications will comply with our{" "}
            <a href="#" className="text-blue-500 underline">
              Data Privacy Policy
            </a>
            .
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#EF5A6F] text-white py-4 rounded hover:bg-red-500 hover:scale-105 active:scale-95 transform transition-transform duration-150"
          >
            Register
          </button>

          {/* Agreement */}
          <div className="text-sm text-center mt-4">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-500 underline">
              Data Privacy Policy
            </a>
            .
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
//Really needed chatgpt help for this one

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Custom Label component for better accessibility and larger font
const Label = ({ htmlFor, value }) => (
  <label
    htmlFor={htmlFor}
    className="block text-lg font-medium text-gray-700 dark:text-gray-200"
  >
    {value}
  </label>
);

export default function Signup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Additional validation can be done here
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.firstname ||
      !formData.lastname
    ) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        throw new Error(data.message || "An error occurred while registering.");
      }
      navigate("/sign-in");
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8 dark:bg-gray-900">
      <div className="w-full max-w-xl p-10 space-y-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <Link to="/" className="flex items-center justify-center mb-8">
          <img
            src="/FindNestRedLogo-W.svg"
            className="mr-2 h-8 sm:h-12"
            alt="FindNest Logo"
          />
          <span className="text-3xl font-bold text-gray-800 dark:text-white">
            Sign Up
          </span>
        </Link>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstname" value="First Name" />
            <input
              type="text"
              id="firstname"
              placeholder="First Name"
              className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastname" value="Last Name" />
            <input
              type="text"
              id="lastname"
              placeholder="Last Name"
              className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="username" value="Username" />
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <Label htmlFor="password" value="Password" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {errorMessage && (
            <p className="text-red-500 text-center mt-2">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

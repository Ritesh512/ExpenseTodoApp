import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import expense from "../assets/images/expense1.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result = await fetch(
        "https://expense-todo-five.vercel.app/api/users/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        },
      );

      result = await result.json();

      if (result.token) {
        localStorage.setItem("user", JSON.stringify(result.loginUser));
        localStorage.setItem("token", result.token);
        toast.success("Login Successfully");
        navigate("/");
      } else {
        toast.warning(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-500 flex items-center justify-center">
      {/* BACKGROUND IMAGE (mobile) */}
      <img
        src={expense}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* OVERLAY for better readability */}
      <div className="absolute inset-0 bg-black/40 md:hidden"></div>

      {/* DESKTOP LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src={expense}
          alt="login illustration"
          className="object-cover w-full h-full"
        />
      </div>

      {/* LOGIN SECTION */}
      <div className="relative flex flex-col justify-center  items-center w-full md:w-1/2 px-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg text-black px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="user">User</option>
            </select> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {loading ? "Taking you in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

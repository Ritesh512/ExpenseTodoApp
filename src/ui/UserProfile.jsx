import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuth from "../api/checkauth";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/user/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
                },
            });

            const isAuthValid = await checkAuth(response);
            if (!isAuthValid) {
                navigate("/login"); // Redirect to login if authentication fails
                return;
            }

            const data = await response.json();
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    fetchProfile();
}, []);


  if (!profile) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <img
        src={profile.avatar || "/default-avatar.png"}
        alt="User Avatar"
        className="avatar"
      />
      <h2>{profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Pending To-Dos: {profile.todoPending}</p>
      <p>Completed To-Dos: {profile.todoDone}</p>
      <p>Current Month Expense: ${profile.currentMonthExpense}</p>
      <p>Top Expense: {profile.topExpense.category} - ${profile.topExpense.amount}</p>
      <p>Last Month Expense: ${profile.lastMonthExpense}</p>
    </div>
  );
};

export default UserProfile;

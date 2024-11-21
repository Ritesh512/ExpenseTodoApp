import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/user/profile")
      .then((response) => response.json())
      .then((data) => setProfile(data));
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

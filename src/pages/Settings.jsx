import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const auth = JSON.parse(localStorage.getItem("user") || "{}");

  const [name] = useState(auth.username);
  const [email] = useState(auth.email);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://expense-todo-five.vercel.app/api/users/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: auth._id,
            password,
            newPassword,
            role: auth.role,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Error changing password");
      } else {
        toast.success("Password changed successfully");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      {/* PROFILE INFO */}

      <div
        className="rounded-lg p-4 sm:p-5"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Profile</h2>

        <div className="space-y-3 text-sm">
          <InfoRow label="Name" value={name} />
          <InfoRow label="Email" value={email} />
        </div>
      </div>

      {/* CHANGE PASSWORD */}

      <div
        className="rounded-lg p-4 sm:p-5"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>

        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <button
            onClick={handleChangePassword}
            className="w-full py-2.5 rounded-md font-semibold text-white transition"
            style={{ background: "var(--color-brand-500)" }}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

/* Reusable info row */

const InfoRow = ({ label, value }) => (
  <div
    className="flex justify-between border-b pb-2"
    style={{ borderColor: "var(--border-color)" }}
  >
    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/* Reusable input */

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-md text-sm outline-none transition"
    style={{
      background: "var(--bg-main)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    }}
  />
);

export default Settings;

import React, { useEffect, useState } from "react";
import ProfileChart from "../ui/ProfileChart";
import checkAuth from "../api/checkauth";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [todo, setTodo] = useState({ pending: [], done: [] });
  const [expense, setExpense] = useState({
    barChartData: [],
    pieChartData: [],
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const profileRes = await fetch(
          `https://expense-todo-five.vercel.app/api/users/profile/${user.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${token}`,
            },
          },
        );

        const isAuthValid = await checkAuth(profileRes);
        if (!isAuthValid) {
          navigate("/login");
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        const todoRes = await fetch(
          "https://expense-todo-five.vercel.app/api/users/todo/lists/summary",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${token}`,
            },
          },
        );

        setTodo(await todoRes.json());

        const expenseRes = await fetch(
          "https://expense-todo-five.vercel.app/api/expenses/dashboard/report",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${token}`,
            },
          },
        );

        setExpense(await expenseRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className=" p-3 md:p-4 space-y-4"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
    >
      {/* PROFILE CARD */}

      <div
        className="rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center gap-4"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <img
          src="/profileImg.jpg"
          alt="Avatar"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-indigo-500"
        />

        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold">
            Welcome back, {profile.username}
          </h2>
          <p
            className="text-xs md:text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.email}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
          <Stat title="Pending" value={profile.todo_pending_count} />
          <Stat
            title="Month Spend"
            value={`₹${profile.current_month_expense}`}
          />
          <Stat
            title="Top Expense"
            value={
              profile?.top_expense?.amount !== "NONE"
                ? profile?.top_expense?.amount
                : "N/A"
            }
          />
          <Stat
            title="Last Month"
            value={`₹${profile.last_month_expense ?? 0}`}
          />
        </div>
      </div>

      {/* ACTIVITY TICKER */}

      <div
        className="rounded-lg shadow-sm p-3 overflow-hidden text-sm"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            ACTIVITY
          </span>

          <div className="whitespace-nowrap animate-[scroll_30s_linear_infinite] flex">
            {todo.pending?.map((task) => (
              <span key={task._id} className="px-4">
                <strong>PENDING:</strong> {task.taskName}
              </span>
            ))}

            {todo.done?.map((task) => (
              <span key={task._id} className="px-4">
                <strong>DONE:</strong> {task.taskName}
              </span>
            ))}

            {expense.barChartData?.slice(-3).map(
              (item, i) =>
                item.total > 0 && (
                  <span key={i} className="px-4">
                    <strong>SPENT:</strong> ₹{item.total} in {item.month}
                  </span>
                ),
            )}
          </div>
        </div>
      </div>

      {/* CHARTS */}

      <div
        className="rounded-lg shadow-md p-4"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h2 className="text-lg font-semibold flex items-center gap-4 mb-4">
          <FaChartLine />
          Expense Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <ProfileChart
            title="Spend Trend"
            data={expense?.barChartData || []}
            type="bar"
            size="50%"
          />

          <ProfileChart
            title="Category Breakdown"
            data={expense?.pieChartData || []}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

/* SMALL STAT COMPONENT */

const Stat = ({ title, value }) => {
  return (
    <div
      className="p-2 rounded-md text-center"
      style={{
        background: "var(--bg-main)",
        border: "1px solid var(--border-color)",
      }}
    >
      <p className="text-[10px] uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <p className="text-sm md:text-base font-semibold">{value}</p>
    </div>
  );
};

export default Dashboard;

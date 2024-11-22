import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileChart from "../ui/ProfileChart";

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const Section = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserProfile = styled(Section)`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .info {
    flex-grow: 1;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-weight:800px;
  }
`;

const VerticalLine = styled.div`
  width: 2px;
  background: #ddd;
  margin: 0 15px;
  height: auto; /* Dynamically adjusts */
  align-self: stretch; /* Stretches vertically to match siblings */
`;


const MarqueeSection = styled(Section)`
  overflow: hidden;
  white-space: nowrap;

  marquee {
    font-size: 1.5rem;
    color: #555;
    font-weight: 600px;
  }
`;

const ExpenseSection = styled(Section)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .chart-container {
    display: flex;
    justify-content: space-around;
    gap: 20px;
  }
`;

// Component
const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [todo, setTodo] = useState({ pending: [], done: [] });
  const [expense, setExpense] = useState({ barChartData: [], pieChartData: [] });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch User Profile
    fetch(`http://localhost:3000/api/users/profile/${user.userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setProfile(data));

    // Fetch To-Do Data
    fetch("http://localhost:3000/api/users/todo/lists/summary",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setTodo(data));

    // Fetch Expense Data
    fetch("http://localhost:3000/api/expenses/dashboard/report",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {setExpense(data);console.log(data)});
  }, []);

  return (
    <DashboardContainer>
      {/* User Profile Section */}
      <UserProfile>
        <img
          src="/profileImg.jpg"
          alt="Avatar"
        />
        <div className="info">
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
        </div>
        <VerticalLine />
        <div className="stats">
          <p>Pending Tasks: {profile.todo_pending_count}</p>
          {/* <p>Done Tasks: {profile.todo_done_count}</p> */}
          <p>Current Month Spend: ₹{profile.current_month_expense}</p>
          <p>
            Top Expense: {profile.top_expense?.expenseType} (₹
            {profile.top_expense?.amount})
          </p>
          <p>Last Month Spend: ₹{profile.last_month_expense}</p>
          {/* <p>Current Month to Date: ₹{profile.current_month_to_date}</p> */}
        </div>
      </UserProfile>

      {/* To-Do Marquee Section */}
      <MarqueeSection>
        <marquee>
          {todo.pending.slice(0, 5).map((task) => `Pending: ${task.taskName} | `)}
          {todo.done.slice(0, 5).map((task) => `Done: ${task.taskName} | `)}
        </marquee>
      </MarqueeSection>

      {/* Expense Report Section */}
      <ExpenseSection>
        <h2>Expense Report</h2>
        <div className="chart-container">
          <ProfileChart title="Expense Breakdown" data={expense?.barChartData|| []} type="bar" />
          <ProfileChart title="Expense Breakdown" data={expense?.pieChartData|| []} type="donut" />
        </div>
      </ExpenseSection>
    </DashboardContainer>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProfileChart from "../ui/ProfileChart";
import checkAuth from "../api/checkauth";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaWallet, FaChartLine, FaHistory } from "react-icons/fa";

/* ================= ANIMATIONS ================= */
const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ================= STYLED COMPONENTS ================= */
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 30px;
  background-color: var(--color-bg-main);
  min-height: 100vh;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 20px;
  }
`;

const GlassSection = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 24px;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-lg);
  }
`;

const UserProfile = styled(GlassSection)`
  display: flex;
  align-items: center;
  gap: 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    z-index: 0;
  }

  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 3px solid var(--color-brand-500);
    padding: 3px;
    z-index: 1;

    @media (max-width: 768px) {
      width: 70px;
      height: 70px;
    }
  }

  .info {
    flex-grow: 1;
    z-index: 1;
    
    h2 {
      font-size: 2.4rem;
      color: var(--color-grey-900);
      margin-bottom: 4px;
    }
    p {
      color: var(--color-grey-400);
      font-size: 1.4rem;
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    z-index: 1;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      margin-top: 15px;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 4px;

  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-400);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  & .value {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--color-grey-800);
  }
`;

const TickerWrapper = styled(GlassSection)`
  padding: 12px 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TickerLabel = styled.div`
  background: var(--color-brand-500);
  color: white;
  padding: 4px 12px;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 700;
  text-wrap: nowrap;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
`;

const TickerContent = styled.div`
  display: flex;
  white-space: nowrap;
  padding-left: 100%;
  animation: ${scroll} 30s linear infinite;

  span {
    padding: 0 20px;
    font-size: 1.5rem;
    color: var(--color-grey-600);
    font-weight: 500;

    strong {
      color: var(--color-grey-800);
      margin-right: 4px;
    }
  }

  &:hover {
    animation-play-state: paused;
  }
`;

const ExpenseSection = styled(GlassSection)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;

  h2 {
    font-size: 2.2res;
    color: var(--color-grey-900);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .chart-container {
    display: flex;
    justify-content: space-around;
    gap: 30px;

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
    }
  }
`;

/* ================= COMPONENT ================= */
const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [todo, setTodo] = useState({ pending: [], done: [] });
  const [expense, setExpense] = useState({ barChartData: [], pieChartData: [] });

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`http://localhost:3000/api/users/profile/${user.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        const isAuthValid = await checkAuth(profileRes);
        if (!isAuthValid) {
          navigate("/login");
          return;
        }
        const profileData = await profileRes.json();
        setProfile(profileData);

        const todoRes = await fetch("http://localhost:3000/api/users/todo/lists/summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        const isTodoAuthValid = await checkAuth(todoRes);
        if (!isTodoAuthValid) {
          navigate("/login");
          return;
        }
        const todoData = await todoRes.json();
        setTodo(todoData);

        const expenseRes = await fetch("http://localhost:3000/api/expenses/dashboard/report", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        const isExpenseAuthValid = await checkAuth(expenseRes);
        if (!isExpenseAuthValid) {
          navigate("/login");
          return;
        }
        const expenseData = await expenseRes.json();
        setExpense(expenseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardContainer>
      <UserProfile>
        <img src="/profileImg.jpg" alt="Avatar" />
        <div className="info">
          <h2>Welcome back, {profile.username}!</h2>
          <p>{profile.email}</p>
        </div>
        <div className="stats">
          <StatCard>
            <span className="label">Pending Tasks</span>
            <span className="value">{profile.todo_pending_count}</span>
          </StatCard>
          <StatCard>
            <span className="label">Month Spend</span>
            <span className="value">₹{profile.current_month_expense}</span>
          </StatCard>
          <StatCard>
            <span className="label">Top Expense</span>
            <span className="value">
              {profile.top_expense && profile.top_expense.expenseType && profile.top_expense.expenseType !== "NONE" 
                ? profile.top_expense.expenseType 
                : 'N/A'}
            </span>
          </StatCard>
          <StatCard>
            <span className="label">Last Month</span>
            <span className="value">₹{profile.last_month_expense ?? 0}</span>
          </StatCard>
        </div>
      </UserProfile>

      <TickerWrapper>
        <TickerLabel>LATEST ACTIVITY</TickerLabel>
        <TickerContent>
          {todo.pending?.length > 0 && todo.pending.map((task) => (
            <span key={task._id}><strong>PENDING:</strong> {task.taskName}</span>
          )) || <span>No pending tasks</span>}
          {todo.done?.length > 0 && todo.done.map((task) => (
            <span key={task._id}><strong>DONE:</strong> {task.taskName}</span>
          ))}
          {expense.barChartData?.slice(-3).map((item, i) => (
            item.total > 0 && <span key={`exp-${i}`}><strong>SPENT:</strong> ₹{item.total} in {item.month}</span>
          ))}
        </TickerContent>
      </TickerWrapper>

      <ExpenseSection>
        <h2><FaChartLine /> Expense Analytics</h2>
        <div className="chart-container">
          <ProfileChart title="Spend Trend" data={expense?.barChartData || []} type="bar" />
          <ProfileChart title="Category Breakdown" data={expense?.pieChartData || []} type="donut" />
        </div>
      </ExpenseSection>
    </DashboardContainer>
  );
};

export default Dashboard;

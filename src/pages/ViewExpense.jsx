import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import checkAuth from '../api/checkauth';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f3ec78, #af4261); /* Gradient background */
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
`;

const DropdownContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ExpenseList = styled.div`
  max-height: 400px; /* Scrollable list */
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transition: background 0.3s;
  }
`;

const ExpenseDetails = styled.div`
  flex-grow: 1;
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: #af4261;
    transform: scale(1.2);
    transition: color 0.2s, transform 0.2s;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default current year
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch expenses on render or when month/year changes
  useEffect(() => {
    fetchExpenses();
  }, [month, year]);

  const fetchExpenses = async () => {
    try {
      setError(null); // Clear any previous errors

      const token = JSON.parse(localStorage.getItem("token"));

      const response = await fetch(
        `http://localhost:3000/api/expenses/filter/month?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        }
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setExpenses(data);

    } catch (error) {
      setError("Failed to fetch expenses. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        toast.success("Expense Deleted!", {
          position: "top-right",
        });
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== id));
      } else {
        const errorData = await response.json();
        toast.warning("Failed to delete!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.warning("Error: ${error.message}", {
        position: "top-right",
      });
    }
  };

  const handleEdit = (id) => {
    // Programmatically navigate to the edit page using the expense ID
    console.log(id);
    navigate(`/expenses/edit/${id}`);
  };

  return (
    <PageContainer>
      <DropdownContainer>
        <div>
          <label>Month: </label>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label>Year: </label>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const yearOption = currentYear - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </Select>

        </div>
      </DropdownContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ExpenseList>
        {expenses.length > 0 ? (
          expenses
            .slice()
            .reverse()
            .map((expense) => (
              <ExpenseItem key={expense._id}>
                <ExpenseDetails>
                  <div>
                    <strong>{expense.expenseName}</strong> - {expense.expenseType}
                  </div>
                  <div>
                    <small>
                      Date: {new Date(expense.date).toLocaleDateString()} | Issued To:{" "}
                      {expense.issuedTo}
                    </small>
                  </div>
                  <div>
                    <strong>₹{expense.amount.toFixed(2)}</strong>
                  </div>
                </ExpenseDetails>
                <ActionIcons>
                  <IconButton onClick={() => handleEdit(expense._id)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => deleteExpense(expense._id)}>
                    <FaTrash />
                  </IconButton>
                </ActionIcons>
              </ExpenseItem>
            ))
        ) : (
          <div>No expenses found for this period.</div>
        )}
      </ExpenseList>

    </PageContainer>
  );
};

export default ViewExpense;


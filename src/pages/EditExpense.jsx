import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../ui/ExpenseForm';
import { toast } from 'react-toastify';
import checkAuth from '../api/checkauth';

const EditExpense = () => {
  const { id } = useParams(); // Get the expense ID from URL
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        });

        const isAuthValid = await checkAuth(response);
        if (!isAuthValid) {
            navigate("/login");
            return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch expense data");
        }

        const data = await response.json();
        setExpense(data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchExpense();
  }, [id]);

  const handleEditExpense = async (expenseData) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      const isAuthValid = await checkAuth(response);
        if (!isAuthValid) {
            navigate("/login");
            return;
        }

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      toast.success("Expense Saved!", {
        position: "top-right",
      });

      navigate("/expenses"); // Redirect to the list of expenses after successful update
    } catch (error) {
      alert(error.message);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format as MM/DD/YYYY
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero if needed
    const day = (`0${date.getDate()}`).slice(-2); // Add leading zero if needed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD format for date input
  };


  return (
    <div>
      <h1>Edit Expense</h1>
      {expense ? (
        <ExpenseForm
          initialData={{
            ...expense,
            // Format the date for the form
            date: formatDate(expense.date),
          }}
          onSubmit={handleEditExpense}
          submitButtonText="Update Expense"
        />
      ) : (
        <p>Loading expense data...</p>
      )}
    </div>
  );
};

export default EditExpense;

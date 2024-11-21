import React from 'react';
import ExpenseForm from '../ui/ExpenseForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddExpense = () => {
  const navigate = useNavigate();

  const handleAddExpense = async (expenseData) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      toast.success("New Expense added!", {
        position: "top-right",
      });

      navigate("/expenses"); // Redirect to expense list after successful addition
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <ExpenseForm onSubmit={handleAddExpense} submitButtonText="Add Expense" />
    </div>
  );
};

export default AddExpense;

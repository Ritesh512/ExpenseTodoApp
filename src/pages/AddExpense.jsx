import React from 'react';
import ExpenseForm from '../ui/ExpenseForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import checkAuth from '../api/checkauth';
import styled from 'styled-components';

const PageWrapper = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 3rem;
    color: var(--color-grey-900);
    margin-bottom: 8px;
  }
  
  p {
    color: var(--color-grey-400);
    font-size: 1.6rem;
  }
`;

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

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      toast.success("New Expense added!", {
        position: "top-right",
      });

      navigate("/expenses"); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <h1>Add New Expense</h1>
        <p>Log your daily expenses to stay on track</p>
      </Header>
      <ExpenseForm onSubmit={handleAddExpense} submitButtonText="Add Expense" />
    </PageWrapper>
  );
};

export default AddExpense;

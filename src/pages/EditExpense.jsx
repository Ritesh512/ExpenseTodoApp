import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../ui/ExpenseForm';
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

const EditExpense = () => {
  const { id } = useParams(); 
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
        toast.error(error.message);
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

      navigate("/expenses"); 
    } catch (error) {
      toast.error(error.message);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (`0${date.getMonth() + 1}`).slice(-2); 
    const day = (`0${date.getDate()}`).slice(-2); 
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; 
  };


  return (
    <PageWrapper>
      <Header>
        <h1>Edit Expense</h1>
        <p>Update your expense details</p>
      </Header>
      
      {expense ? (
        <ExpenseForm
          initialData={{
            ...expense,
            date: formatDate(expense.date),
          }}
          onSubmit={handleEditExpense}
          submitButtonText="Update Expense"
        />
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--color-grey-400)', fontSize: '1.8rem' }}>
          Loading expense data...
        </div>
      )}
    </PageWrapper>
  );
};

export default EditExpense;

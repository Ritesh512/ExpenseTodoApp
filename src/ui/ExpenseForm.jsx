import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Container for the form
const FormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%; /* Full width on smaller screens */
  }
`;

// Input fields styling
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// Select dropdown styling
const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Adjust font size for smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Smaller font size for extra small screens */
  }

  /* Target the dropdown options for smaller screens */
  @media (max-width: 480px) {
    option {
      font-size: 12px; /* Smaller font size for dropdown options */
      padding: 8px; /* Reduce padding for smaller options */
    }
  }
`;

// Button styling
const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Smaller font size on mobile */
    padding: 10px 18px;
  }
`;

const ExpenseForm = ({ initialData = {}, onSubmit, submitButtonText }) => {
    const [expenseName, setExpenseName] = useState(initialData.expenseName || '');
    const [expenseType, setExpenseType] = useState(initialData.expenseType || '');
    const [date, setDate] = useState(initialData.date || '');
    const [issuedTo, setIssuedTo] = useState(initialData.issuedTo || '');
    const [amount, setAmount] = useState(initialData.amount || '');

    useEffect(() => {
        if (initialData._id) {
            setExpenseName(initialData.expenseName);
            setExpenseType(initialData.expenseType);
            setDate(initialData.date);
            setIssuedTo(initialData.issuedTo);
            setAmount(initialData.amount);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const expenseData = {
            expenseName,
            expenseType,
            date,
            issuedTo,
            amount,
        };
        onSubmit(expenseData);
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Expense Name"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                />
                <Select
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value)}
                >
                    {/* Dropdown options */}
                    <option value="Retail">Retail</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Gold">Gold</option>
                    <option value="SIP">SIP</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Other">Other</option>
                </Select>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Issued To"
                    value={issuedTo}
                    onChange={(e) => setIssuedTo(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Button type="submit">{submitButtonText}</Button>
            </form>
        </FormContainer>
    );
};

export default ExpenseForm;

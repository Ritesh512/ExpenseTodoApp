import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 20px;
  background-color: #fff; /* Neutral background color */
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;
`;

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

`;

const Button = styled.button`
  background-color: #4caf50; /* Updated button color */
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
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
                    <option value="Custom">Custom</option>
                    <option value="Retail">Retail</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Utilities">Utilities</option>
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

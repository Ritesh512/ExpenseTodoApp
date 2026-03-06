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

const predefinedTypes = ["Retail", "Electronic", "Food", "Travel", "Utilities", "Gold", "SIP", "Medicine"];


const ExpenseForm = ({ initialData = {}, onSubmit, submitButtonText }) => {
  const [expenseName, setExpenseName] = useState(initialData.expenseName || '');
  const [expenseType, setExpenseType] = useState(initialData.expenseType || '');
  const [customExpenseType, setCustomExpenseType] = useState('');
  // Default to today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [date, setDate] = useState(initialData.date || getTodayDate());
  const [issuedTo, setIssuedTo] = useState(initialData.issuedTo || '');
  const [amount, setAmount] = useState(initialData.amount || '');

  useEffect(() => {
    if (initialData._id) {
      setExpenseName(initialData.expenseName);
      // if the initial expenseType is not one of predefined types, treat it as custom
      if (initialData.expenseType && !predefinedTypes.includes(initialData.expenseType)) {
        setExpenseType('Other');
        setCustomExpenseType(initialData.expenseType);
      } else {
        setExpenseType(initialData.expenseType || 'Retail');
      }
      setDate(initialData.date);
      setIssuedTo(initialData.issuedTo);
      setAmount(initialData.amount);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawType = expenseType === 'Other'
      ? (customExpenseType || 'Other')
      : expenseType;

    const normalized = String(rawType).trim();
    const formattedType = normalized
      ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
      : 'Other';

    const expenseData = {
      expenseName,
      expenseType: formattedType,
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

        {/* Expense Type input with suggestions (typeable) + optional custom input when 'Other' selected */}
        <Input
          type="text"
          list="expense-types"
          placeholder="Expense Type (e.g. Food, Travel, Custom)"
          value={expenseType === 'Other' && customExpenseType ? customExpenseType : expenseType}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'Other') {
              setExpenseType('Other');
              setCustomExpenseType('');
            } else if (predefinedTypes.includes(v)) {
              setExpenseType(v);
              setCustomExpenseType('');
            } else {
              // treat as typed/custom value
              setExpenseType(v);
              setCustomExpenseType(v);
            }
          }}
        />
        <datalist id="expense-types">
          <option value="Retail" />
          <option value="Electronic" />
          <option value="Food" />
          <option value="Travel" />
          <option value="Utilities" />
          <option value="Gold" />
          <option value="SIP" />
          <option value="Medicine" />
          <option value="Other" />
        </datalist>

        {/* Note: single typeable input above handles both selecting and typing custom values. */}

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

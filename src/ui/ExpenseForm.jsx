import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 30px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  max-width: 500px;
  margin: 20px auto;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
    max-width: 100%;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 1.3rem;
    color: var(--color-grey-400);
    font-weight: 500;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  color: var(--color-grey-800);
  font-size: 1.6rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 14px;
  font-size: 1.6rem;
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: 10px;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const predefinedTypes = ["Retail", "Electronic", "Food", "Travel", "Utilities", "Gold", "SIP", "Medicine"];

const ExpenseForm = ({ initialData = {}, onSubmit, submitButtonText }) => {
  const [expenseName, setExpenseName] = useState(initialData.expenseName || '');
  const [expenseType, setExpenseType] = useState(initialData.expenseType || '');
  const [customExpenseType, setCustomExpenseType] = useState('');
  
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
        <FormGroup>
          <label>Expense Name</label>
          <Input
            type="text"
            placeholder="e.g. Monthly Grocery"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Category</label>
          <Input
            type="text"
            list="expense-types"
            placeholder="Select or type..."
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
                setExpenseType(v);
                setCustomExpenseType(v);
              }
            }}
            required
          />
          <datalist id="expense-types">
            {predefinedTypes.map(type => <option key={type} value={type} />)}
            <option value="Other" />
          </datalist>
        </FormGroup>

        <FormGroup>
          <label>Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Issued To</label>
          <Input
            type="text"
            placeholder="e.g. Amazon, Local Shop"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Amount (₹)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit">{submitButtonText}</Button>
      </form>
    </FormContainer>
  );
};

export default ExpenseForm;

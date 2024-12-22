import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const SummaryContainer = styled.div`
  background-color: #f0f4f8;  // Light blue background
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const SummaryHeader = styled.h2`
  color: #1a73e8;  // Dark blue header color
  font-size: 18px;
  margin-bottom: 10px;
`;

const SummaryItem = styled.div`
  color: ${(props) => (props.isPositive ? '#28a745' : '#dc3545')};  // Green if positive, Red if negative
  font-size: 16px;
  margin: 8px 0;
`;

const SummaryItemContent = ({ isPositive, children }) => (
  <div style={{ color: isPositive ? '#28a745' : '#dc3545', fontSize: '16px', margin: '8px 0' }}>
    {children}
  </div>
);

const Summary = ({ summary, month1Name, month2Name }) => {
  const { total1, total2, topExpenseDiff } = summary;
  const { expenseType, amountDiff } = topExpenseDiff;

  return (
    <SummaryContainer>
      <SummaryHeader>Comparison Summary: {month1Name} vs {month2Name}</SummaryHeader>
      <SummaryItemContent isPositive={total1 > total2}>
        {month1Name}: ₹{total1.toLocaleString()}
      </SummaryItemContent>
      <SummaryItemContent isPositive={total2 > total1}>
        {month2Name}: ₹{total2.toLocaleString()}
      </SummaryItemContent>
      <SummaryItemContent isPositive={amountDiff > 0}>
        {expenseType}: ₹{amountDiff.toLocaleString()}
      </SummaryItemContent>
    </SummaryContainer>
  );
};

export default Summary;
import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const SummaryContainer = styled.div`
  background-color: #f0f4f8;  // Light blue background
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryHeader = styled.h3`
  color: #1a73e8;  // Dark blue header color
  font-size: 18px;
  margin-bottom: 10px;
`;

const SummaryItem = styled.div`
  color: ${(props) => (props.isPositive ? '#28a745' : '#dc3545')};  // Green if positive, Red if negative
  font-size: 16px;
  margin: 8px 0;
`;

const Summary = ({ summary, month1Name, month2Name }) => {
  const { total1, total2, topExpenseDiff } = summary;
  const { expenseType, amountDiff } = topExpenseDiff;

  return (
    <SummaryContainer>
      <SummaryHeader>Comparison Summary: {month1Name} vs {month2Name}</SummaryHeader>
      <SummaryItem isPositive={total1 > total2}>
        {month1Name}: ₹{total1.toLocaleString()}
      </SummaryItem>
      <SummaryItem isPositive={total2 > total1}>
        {month2Name}: ₹{total2.toLocaleString()}
      </SummaryItem>
      <SummaryItem isPositive={amountDiff > 0}>
        Most Expensive Item Difference: {expenseType} (₹{Math.abs(amountDiff).toLocaleString()})
      </SummaryItem>
    </SummaryContainer>
  );
};

export default Summary;

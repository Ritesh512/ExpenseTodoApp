import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SummaryCard = ({ totalSpending }) => (
  <Card>
    <h3>Summary</h3>
    <p>Total Spending: ₹{totalSpending}</p>
  </Card>
);

export default SummaryCard;

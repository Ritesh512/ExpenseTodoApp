import React, { useState } from 'react';
import styled from 'styled-components';

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-right: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #1558b0;
  }
`;

const Filters = ({ setFilters }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilters = () => {
    setFilters({ startDate, endDate });
  };

  return (
    <FiltersContainer>
      <div>
        <Label htmlFor="start-date">Start Date:</Label>
        <Input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="end-date">End Date:</Label>
        <Input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Button onClick={handleApplyFilters}>Apply</Button>

    </FiltersContainer>
  );
};

export default Filters;

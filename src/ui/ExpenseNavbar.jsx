import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for the Navbar
const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #4e54c8, #8f94fb); 
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  flex-wrap: wrap; /* Allow the items to wrap if needed */
  
  /* Always arrange links in a row, even on smaller screens */
  flex-direction: row;
  justify-content: space-between;

  /* Adjustments for smaller screens */
  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for smaller screens */
    gap: 10px; /* Add gap between links */
  }
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-family: 'Roboto', sans-serif; /* Modern font */
  font-weight: 500;
  margin: 0 15px;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &.active {
    background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent active tab */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* Subtle shadow for active tab */
  }

  &:hover {
    transform: scale(1.05); /* Slight zoom effect */
    background-color: rgba(255, 255, 255, 0.15); /* Light hover effect */
  }

  /* Adjust for smaller screens */
  @media (max-width: 768px) {
    font-size: 16px; /* Slightly smaller font on smaller screens */
    padding: 8px 15px; /* Adjust padding for better spacing */
    margin: 0 8px; /* Reduce margin for better fit on small screens */
  }
`;

const ExpenseNavbar = () => {
  return (
    <NavbarContainer>
      <StyledNavLink to="add-expense">Add Expense</StyledNavLink>
      <StyledNavLink to="view-expense">View Expense</StyledNavLink>
      <StyledNavLink to="compare">Compare</StyledNavLink>
      <StyledNavLink to="analysis">Analysis</StyledNavLink>
    </NavbarContainer>
  );
};

export default ExpenseNavbar;

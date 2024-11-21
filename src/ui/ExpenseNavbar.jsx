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

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEye, FaExchangeAlt, FaChartBar, FaRobot } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  margin: 10px 20px;
  gap: 8px;
  position: sticky;
  top: 20px;
  z-index: 50;
  
  @media (max-width: 768px) {
    margin: 5px 10px;
    padding: 8px;
    overflow-x: auto;
    justify-content: flex-start;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--color-grey-500);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: var(--border-radius-md);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;

  & svg {
    font-size: 1.8rem;
    transition: transform 0.3s ease;
  }

  &.active {
    color: var(--color-brand-500);
    background: var(--color-bg-accent);
    box-shadow: inset 0 0 10px rgba(99, 102, 241, 0.1);
    
    & svg {
      transform: scale(1.2);
    }
  }

  &:hover:not(.active) {
    color: var(--color-grey-800);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 8px 16px;
    gap: 8px;
  }
`;

const ExpenseNavbar = () => {
  return (
    <NavbarContainer>
      <StyledNavLink to="add-expense"><FaPlus /> <span>Add Expense</span></StyledNavLink>
      <StyledNavLink to="view-expense"><FaEye /> <span>View Expense</span></StyledNavLink>
      <StyledNavLink to="compare"><FaExchangeAlt /> <span>Compare</span></StyledNavLink>
      <StyledNavLink to="analysis"><FaChartBar /> <span>Analysis</span></StyledNavLink>
      <StyledNavLink to="ai-insights"><FaRobot /> <span>AI Insights</span></StyledNavLink>
    </NavbarContainer>
  );
};

export default ExpenseNavbar;

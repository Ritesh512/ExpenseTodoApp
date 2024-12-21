import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineHome,
} from "react-icons/hi2";
import { FcTodoList } from "react-icons/fc";
import { GiReceiveMoney } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

// Styling the NavList
const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  list-style: none;
  padding: 0;

  /* Horizontal layout for smaller screens */
  @media (max-width: 1024px) {
    flex-direction: row;
    gap: 1rem;
    overflow-x: auto; /* Allows scrolling if there are too many items */
    white-space: nowrap;
  }
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-200);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const Text = styled.span`
  /* Hide text on mobile and tablet screens */
  @media (max-width: 1024px) {
    display: none;
  }
`;

function MainNav() {
  const auth = localStorage.getItem("user");
  const naviagte = useNavigate();
  if (!auth) {
    naviagte("/signup");
  }

  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome />
            <Text>Home</Text>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/todo/default">
            <FcTodoList />
            <Text>Todo</Text>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/expenses">
            <GiReceiveMoney />
            <Text>Expenses</Text>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/birthday">
            <LiaBirthdayCakeSolid />
            <Text>Birthday</Text>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;

import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
} from "react-icons/hi2";
import { AiFillLike } from "react-icons/ai";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { FcTodoList } from "react-icons/fc";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GiReceiveMoney } from "react-icons/gi";


const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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

  /* This works because react-router places the active class on the active NavLink */
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

function MainNav() {
  const auth = localStorage.getItem("user");
  const naviagte = useNavigate();
  if (!auth) {
    naviagte("/signup");
  }
  return (
    <nav>
      <NavList>
          <>
            <li>
              <StyledNavLink to="/dashboard">
                <HiOutlineHome />
                <span>Home</span>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink to="/todo/default">
                <FcTodoList />
                <span>Todo</span>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink to="/expenses">
                <GiReceiveMoney />
                <span>Expenses</span>
              </StyledNavLink>
            </li>
            <li>
              <StyledNavLink to="/birthday">
              <LiaBirthdayCakeSolid />
                <span>Birthday</span>
              </StyledNavLink>
            </li>
          </>
        
        <li>
          {/* <StyledNavLink to="/settings">
            <HiOutlineCog6Tooth />
            <span>Settings</span>
          </StyledNavLink> */}
        </li>
      </NavList>
    </nav>
  );
}

export default MainNav;

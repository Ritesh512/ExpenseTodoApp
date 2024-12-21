import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo"; // Assuming Logo is your logo component

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  /* For smaller screens */
  @media (max-width: 768px) {
    padding: 1rem 2.4rem; /* Reduce padding for smaller screens */
  }
`;

const LogoWrapper = styled.div`
  /* Show logo only for mobile screens */
  @media (max-width: 768px) {
    margin-right: 1rem; /* Add margin between logo and content */
    display: block; /* Show logo on mobile screens */
  }

  /* Hide logo for larger screens (tablet, laptop, etc.) */
  @media (min-width: 769px) {
    display: none; /* Hide logo on tablet, laptop, and larger screens */
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LogoutLink = styled(Link)`
  text-decoration: none;
  color: var(--color-grey-600);
  font-weight: bold;

  &:hover {
    color: var(--color-grey-800);
  }
`;

function Header() {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const location = useLocation();
  const currentTabName = location.pathname.split("/")[1];

  function logout() {
    localStorage.clear();
    navigate("/Signup");
  }

  return (
    <StyledHeader>
      {/* Logo visible only on mobile screens */}
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      <HeaderContent>
        {/* Tab name */}
        <div>{currentTabName.toUpperCase()}</div>

        {/* Logout link */}
        <LogoutLink onClick={logout} to="/login">
          Logout ({JSON.parse(auth).username.split(' ')[0]})
        </LogoutLink>
      </HeaderContent>
    </StyledHeader>
  );
}

export default Header;

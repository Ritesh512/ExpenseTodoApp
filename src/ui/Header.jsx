import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo"; 
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem 2.4rem;
  }
`;

const LogoWrapper = styled.div`
  @media (max-width: 768px) {
    margin-right: 1.5rem;
    display: block;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 2rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ThemeToggle = styled.button`
  background: var(--color-bg-accent);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--color-brand-500);

  &:hover {
    background: var(--color-brand-100);
    transform: translateY(-1px);
  }

  svg {
    width: 2.2rem;
    height: 2.2rem;
  }
`;

const LogoutLink = styled(Link)`
  text-decoration: none;
  color: var(--color-grey-600);
  font-weight: 600;
  font-size: 1.4rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    background: var(--color-grey-100);
    color: var(--color-grey-900);
  }
`;

const TabTitle = styled.div`
  color: var(--color-grey-900);
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

function Header({ theme, toggleTheme }) {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const location = useLocation();
  const currentTabName = location.pathname.split("/")[1] || "Dashboard";

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const username = auth ? JSON.parse(auth).username.split(' ')[0] : "User";

  return (
    <StyledHeader>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      <HeaderContent>
        <TabTitle>{currentTabName}</TabTitle>

        <RightSection>
          <ThemeToggle onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
          </ThemeToggle>

          <LogoutLink onClick={logout} to="/login">
            Logout ({username})
          </LogoutLink>
        </RightSection>
      </HeaderContent>
    </StyledHeader>
  );
}

export default Header;

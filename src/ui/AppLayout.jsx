import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr; /* Sidebar and Main for large screens */
  grid-template-rows: auto 1fr; /* Header and Main content */
  height: 100vh;

  /* For laptops and smaller screens */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* Single column layout */
    grid-template-rows: auto 1fr; /* Header and Main */
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;

  /* Reduce padding for laptops */
  @media (max-width: 1024px) {
    padding: 3rem;
    padding-bottom: 8rem; /* Space for fixed bottom sidebar */
  }

  /* Reduce padding further for tablets and mobile */
  @media (max-width: 768px) {
    padding: 2rem;
    padding-bottom: 9rem; /* Slightly more space for mobile bottom bar */
  }
`;

const BottomSidebarWrapper = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid var(--glass-border);
  z-index: 100; /* Higher z-index */
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
`;

function AppLayout({ theme, toggleTheme }) {
  const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

  return (
    <StyledAppLayout>
      <Header theme={theme} toggleTheme={toggleTheme} />
      {!isSmallScreen && <Sidebar />} {/* Sidebar on larger screens */}
      <Main>
        <Outlet />
      </Main>
      {isSmallScreen && ( 
        /* Sidebar rendered below main content on smaller screens */
        <BottomSidebarWrapper>
          <Sidebar />
        </BottomSidebarWrapper>
      )}
    </StyledAppLayout>
  );
}

export default AppLayout;

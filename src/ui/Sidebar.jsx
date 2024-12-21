import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1; /* Full height by default */
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  /* For tablets and laptops with smaller screens */
  @media (max-width: 1024px) {
    grid-row: auto;
    grid-column: 1 / -1; /* Full width */
    flex-direction: row; /* Horizontal layout */
    justify-content: space-around;
    align-items: center;
    padding: 1.6rem;
    border-right: none; /* Remove right border */
    border-top: 1px solid var(--color-grey-100); /* Add top border */
  }

  /* For mobile screens */
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    width: 100%;
    flex-direction: row; /* Items in a row */
    ${'' /* justify-content: space-between; */}
    align-items: center;
    padding:2rem 1rem; /* Reduced padding */
    border-top: 1px solid var(--color-grey-100); /* Add a top border */
    z-index: 100; /* Ensure it sits above other content */

    /* Hide the Logo component on mobile screens */
    > div:first-child {
      display: none; /* Assuming Logo is the first child of Sidebar */
    }
  }
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}

export default Sidebar;

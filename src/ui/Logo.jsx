import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  /* Add responsive adjustments for mobile */
  padding: 2rem 0;

  /* Adjustments for smaller screens */
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
  max-width: 100%;  /* Ensures the logo scales down properly if needed */

  @media (max-width: 1024px) {
    height: 7rem; /* Slightly smaller for tablet screens */
  }

  @media (max-width: 768px) {
    height: 5rem; /* Adjust logo size for smaller screens like mobile */
  }

  @media (max-width: 480px) {
    height: 4rem; /* Further adjust for very small screens */
  }
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="/Logo.png" alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;

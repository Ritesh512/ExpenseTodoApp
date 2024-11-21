import React, { useState, useRef } from "react";
import styled from "styled-components";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  margin: 0;
  font-family: "Arial, sans-serif";
`;

const CardWrapper = styled.div`
  position: relative;
  text-align: center;
`;

const Card = styled.div`
  width: 400px;
  background: linear-gradient(145deg, #ffecd2, #fcb69f);
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  font-size: 2.2rem;
  background: linear-gradient(to right, #ff6a95, #ff9a9e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 10px;
`;

const SubHeader = styled.h3`
  font-size: 1.5rem;
  color: #555;
  margin: 0 0 20px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px;
  font-size: 1.5rem;
  border: 2px solid #ff9a9e;
  border-radius: 5px;
  margin-bottom: 20px;
  outline: none;
  width: 300px;
`;

const Button = styled.button`
  background: linear-gradient(to right, #ff758c, #ff7eb3);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  margin-right: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Birthday = () => {
  const [name, setName] = useState("");
  const cardRef = useRef();

  // Handle Download as PNG or PDF
  const handleDownload = (format) => {
    const element = cardRef.current;
    html2canvas(element).then((canvas) => {
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${name}_birthday_card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 15, 15, 180, 150);
        pdf.save(`${name}_birthday_card.pdf`);
      }
    });
  };

  return (
    <PageWrapper>
      <Input
        type="text"
        placeholder="Enter name here"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CardWrapper ref={cardRef}>
        <Card>
          <Header>Happy Birthday {name}!</Header>
          <SubHeader>🎉 Wishing You the Best! 🎂</SubHeader>
          <Message>
            May your day be filled with love, laughter, and everything you’ve
            wished for!
          </Message>
        </Card>
      </CardWrapper>
      <div>
        <Button onClick={() => handleDownload("png")}>Download as PNG</Button>
        <Button onClick={() => handleDownload("pdf")}>Download as PDF</Button>
      </div>
    </PageWrapper>
  );
};

export default Birthday;

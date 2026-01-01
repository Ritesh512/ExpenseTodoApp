import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MainContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: linear-gradient(to bottom, #fceabb, #f8b500);
  min-height: 100vh;
  color: #333;
  font-family: 'Arial', sans-serif;
`;

const TemplateRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
`;

const TemplateCard = styled.div`
  width: 300px;
  height: 400px;
  padding: 20px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s, background 0.3s;
  &:hover {
    background: #ffecd2;
    transform: scale(1.05);
  }
`;

const TemplateContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
`;

const GreetingImage = styled.div`
  width: 80%;
  height: 150px;
  background: url('https://api.unsplash.com/300x150/?birthday,party') center/cover no-repeat;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const GreetingText = styled.h3`
  font-size: 24px;
  color: #f57c00;
  margin-bottom: 10px;
  font-weight: bold;
`;

const GreetingMessage = styled.p`
  font-size: 16px;
  color: #666;
  font-style: italic;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Popup = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
`;

const PopupInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const PopupButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(to right, #ff4081, #f06292);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background: #e91e63;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 18px;
  color: #888;
  &:hover {
    color: #000;
  }
`;

const BirthdayTemplate = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleDownload = (type) => {
    const element = document.getElementById(selectedTemplate);
    html2canvas(element).then((canvas) => {
      if (type === 'png') {
        const link = document.createElement('a');
        link.download = `${name}_birthday.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (type === 'pdf') {
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL(), 'PNG', 0, 0, 210, 297);
        pdf.save(`${name}_birthday.pdf`);
      }
      setShowPopup(false);
    });
  };

  const templates = [
    {
      id: 'template-1',
      message: 'Wishing you a day filled with love and cheer!',
    },
    {
      id: 'template-2',
      message: 'May all your dreams come true on this special day!',
    },
    {
      id: 'template-3',
      message: 'Have a fantastic birthday celebration! 🎉',
    },
  ];

  return (
    <MainContainer>
      <TemplateRow>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template.id);
              setShowPopup(true);
            }}
          >
            <TemplateContent id={template.id}>
              <GreetingImage />
              <GreetingText>{name ? `Happy Birthday, ${name}!` : 'Your Special Day!'}</GreetingText>
              <GreetingMessage>{template.message}</GreetingMessage>
            </TemplateContent>
          </TemplateCard>
        ))}
      </TemplateRow>

      {showPopup && (
        <PopupContainer>
          <Popup>
            <CloseButton onClick={() => setShowPopup(false)}>×</CloseButton>
            <h3>Enter Name</h3>
            <PopupInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <PopupButton onClick={() => handleDownload('png')}>Download PNG</PopupButton>
              <PopupButton onClick={() => handleDownload('pdf')}>Download PDF</PopupButton>
            </div>
          </Popup>
        </PopupContainer>
      )}
    </MainContainer>
  );
};

export default BirthdayTemplate;

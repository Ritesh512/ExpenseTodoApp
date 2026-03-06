import React, { useState } from 'react';
import styled from 'styled-components';
import AIInsights from '../ui/AIInsights';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f3ec78, #af4261);
  padding: 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const Header = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  margin: 10px 0 0 0;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const AIInsightsPage = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

    const [dateRange] = useState({ startDate: startOfMonth, endDate: endOfMonth });
    const [month] = useState(today.getMonth() + 1);
    const [year] = useState(today.getFullYear());

    return (
        <PageContainer>
            <ContentWrapper>
                <Header>
                    <Title>🤖 AI Insights</Title>
                    <Subtitle>
                        Get AI-powered analysis, personalized recommendations, and spending forecasts
                    </Subtitle>
                </Header>

                <AIInsights dateRange={dateRange} month={month} year={year} />
            </ContentWrapper>
        </PageContainer>
    );
};

export default AIInsightsPage;

import React, { useState } from 'react';
import styled from 'styled-components';
import AIInsights from '../ui/AIInsights';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-bg-main);
  padding: 40px 20px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--color-brand-600);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  color: var(--color-grey-900);
  margin: 0;
  font-size: 2.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 1.2rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: var(--color-grey-500);
  margin: 8px 0 0 0;
  font-size: 1.6rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.4rem;
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

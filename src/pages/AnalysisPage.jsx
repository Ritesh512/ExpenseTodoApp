import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Chart from 'react-apexcharts';
import { getCategoryBreakdown, getSpendingTrends, getTopExpenses, getLowExpenses } from '../api/analysis';
import SummaryCard from '../ui/SummaryCard';
import GraphCard from '../ui/GraphCard';
import Filters from '../ui/Filters';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from "react-router-dom";

const AnalysisContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-around;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;  // Smaller gap between charts on mobile
    margin-bottom: 70px;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 16px;
  text-align: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 90%;  // Adjust card width for tablets
  }

  @media (max-width: 480px) {
    max-width: 100%;  // Full width on small mobile screens
    padding: 15px;
  }
`;

const Title = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const AnalysisPage = () => {
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [spendingTrends, setSpendingTrends] = useState({ xData: [], yData: [] });
  const [topExpenses, setTopExpenses] = useState([]);
  const [lowExpenses, setLowExpenses] = useState([]);
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate: startOfMonth, endDate: endOfMonth };
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(''); // Clear any previous errors
        const categoryData = await getCategoryBreakdown(filters);
        setCategoryBreakdown(categoryData || {});

        const trendData = await getSpendingTrends(filters);
        const xData = trendData.spendingTrends.map((entry) => entry.date);
        const yData = trendData.spendingTrends.map((entry) => entry.amount);

        setSpendingTrends({ xData, yData });

        const topExpensesData = await getTopExpenses(filters);
        setTopExpenses(topExpensesData || []);

        const lowExpensesData = await getLowExpenses(filters);
        setLowExpenses(lowExpensesData || []);
      } catch (err) {
        console.error(err);
        if (
          err.message.includes("Authentication failed") ||
          err.message.includes("Invalid or expired token")
        ) {
          // Handle logout on authentication failure
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to fetch analysis data. Please try again later.");
        }
      }
    }

    fetchData();
  }, [filters]);

  return (
    <AnalysisContainer>
      <FilterHeader>
        <Filters setFilters={setFilters} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SummaryCard totalSpending={categoryBreakdown?.totalSpending || 0} />
      </FilterHeader>

      <ChartsContainer>
        <GraphCard
          title="Category Breakdown"
          data={categoryBreakdown?.categoryBreakdown || []}
          type="donut"
        />

        <Card>
          <Title>Spending Trends</Title>
          {spendingTrends && spendingTrends.xData?.length && spendingTrends.yData?.length ? (
            <LineChart
              xAxis={[{ data: spendingTrends.xData, scaleType: 'time' }]} // Time scale for dates
              series={[{ data: spendingTrends.yData }]}
              width={385}
              height={300}
              grid={{ vertical: true, horizontal: true }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              No data available
            </div>
          )}
        </Card>

        <GraphCard
          title="Top Expenses"
          data={topExpenses.topExpenses || []}
          type="bar"
        />

        <GraphCard
          title="Low Expenses"
          data={lowExpenses.lowestExpenses || []}
          type="bar"
        />
      </ChartsContainer>
    </AnalysisContainer>
  );
};

export default AnalysisPage;

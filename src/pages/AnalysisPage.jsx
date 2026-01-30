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
    margin-bottom: 120px;  // Increased margin for footer clearance
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    margin-bottom: 100px;
    padding: 0 5px;
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
    margin-bottom: 10px;  // Add spacing between cards
  }

  @media (max-width: 480px) {
    max-width: 100%;  // Full width on small mobile screens
    padding: 15px;
    margin-bottom: 15px;
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4CAF50;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const MetricValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const DatePresets = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const PresetButton = styled.button`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: ${props => props.active ? '#45a049' : '#f5f5f5'};
  }
`;

const AnalysisPage = () => {
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [spendingTrends, setSpendingTrends] = useState({ xData: [], yData: [] });
  const [topExpenses, setTopExpenses] = useState([]);
  const [lowExpenses, setLowExpenses] = useState([]);
  const [activePreset, setActivePreset] = useState('thisMonth');
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    return { startDate: startOfMonth, endDate: endOfMonth };
  });
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setActivePreset('custom'); // Reset to custom when manually changed
  };

  // Date preset handlers
  const applyDatePreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'last7days':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case 'last30days':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return;
    }

    const newFilters = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    setFilters(newFilters);
    setActivePreset(preset);
  };

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    const totalSpending = categoryBreakdown?.totalSpending || 0;

    // Calculate number of days in the selected period
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

    // Calculate average daily spending based on date range
    const avgDailySpending = daysDiff > 0
      ? (totalSpending / daysDiff).toFixed(2)
      : '0.00';

    // Find most expensive category
    const topCategory = categoryBreakdown?.categoryBreakdown?.length > 0
      ? categoryBreakdown.categoryBreakdown.reduce((prev, current) =>
        (prev?.amount || 0) > (current?.amount || 0) ? prev : current
      )
      : null;

    // Number of data points (days with spending)
    const dataPoints = spendingTrends.yData?.length || 0;

    return {
      totalSpending: Number(totalSpending) || 0,
      avgDailySpending,
      topCategory: topCategory?.category || 'N/A',
      dataPoints
    };
  };

  const summaryMetrics = calculateSummaryMetrics();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(''); // Clear any previous errors
        const categoryData = await getCategoryBreakdown(filters);
        setCategoryBreakdown(categoryData || {});

        // Fetch daily data and group by weeks
        const trendData = await getSpendingTrends({ ...filters, interval: 'daily' });
        
        // Group daily data by weeks within the selected month
        const weeklyData = {};
        trendData.spendingTrends.forEach((entry) => {
          const date = new Date(entry.date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          
          // Calculate week number within the month (1-5)
          const weekNum = Math.ceil(day / 7);
          const weekKey = `${year}-${month}-${weekNum}`;
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
              weekNum,
              month: date.toLocaleDateString('en-US', { month: 'short' }),
              total: 0,
              count: 0
            };
          }
          
          weeklyData[weekKey].total += Number(entry.amount) || 0;
          weeklyData[weekKey].count += 1;
        });
        
        // Convert to arrays for chart
        const xData = Object.values(weeklyData).map(week => `Week ${week.weekNum} (${week.month})`);
        const yData = Object.values(weeklyData).map(week => Number(week.total) || 0);
        
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

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnalysisContainer>
      <FilterHeader>
        <div style={{ width: '100%' }}>
          <DatePresets>
            <PresetButton
              active={activePreset === 'last7days'}
              onClick={() => applyDatePreset('last7days')}
            >
              Last 7 Days
            </PresetButton>
            <PresetButton
              active={activePreset === 'last30days'}
              onClick={() => applyDatePreset('last30days')}
            >
              Last 30 Days
            </PresetButton>
            <PresetButton
              active={activePreset === 'thisMonth'}
              onClick={() => applyDatePreset('thisMonth')}
            >
              This Month
            </PresetButton>
            <PresetButton
              active={activePreset === 'lastMonth'}
              onClick={() => applyDatePreset('lastMonth')}
            >
              Last Month
            </PresetButton>
            <PresetButton
              active={activePreset === 'thisYear'}
              onClick={() => applyDatePreset('thisYear')}
            >
              This Year
            </PresetButton>
          </DatePresets>
          <Filters setFilters={handleFilterChange} currentFilters={filters} />
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {/* <SummaryCard totalSpending={categoryBreakdown?.totalSpending || 0} /> */}
      </FilterHeader>

      <SummaryGrid>
        <MetricCard>
          <MetricValue>₹{summaryMetrics.totalSpending.toLocaleString('en-IN')}</MetricValue>
          <MetricLabel>Total Spending</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>₹{summaryMetrics.avgDailySpending}</MetricValue>
          <MetricLabel>Avg Daily Spending</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{summaryMetrics.topCategory}</MetricValue>
          <MetricLabel>Top Category</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{summaryMetrics.dataPoints}</MetricValue>
          <MetricLabel>Data Points</MetricLabel>
        </MetricCard>
      </SummaryGrid>

      <ChartsContainer>
        <GraphCard
          title="Category Breakdown"
          data={categoryBreakdown?.categoryBreakdown || []}
          type="donut"
        />

        <Card>
          <Title>Weekly Spending Trends</Title>
          {spendingTrends && spendingTrends.xData?.length && spendingTrends.yData?.length ? (
            <div style={{ width: '100%', height: windowWidth < 768 ? '250px' : '300px' }}>
              <LineChart
                xAxis={[{ 
                  data: spendingTrends.xData, 
                  scaleType: 'band',
                  tickLabelStyle: {
                    fontSize: windowWidth < 768 ? 10 : 12,
                    angle: windowWidth < 768 ? -45 : 0,
                    textAnchor: windowWidth < 768 ? 'end' : 'middle'
                  }
                }]}
                yAxis={[{
                  valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`
                }]}
                series={[{ 
                  data: spendingTrends.yData.map(val => Number(val) || 0),
                  valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`
                }]}
                width={windowWidth < 768 ? windowWidth - 80 : 385}
                height={windowWidth < 768 ? 250 : 300}
                grid={{ vertical: true, horizontal: true }}
                margin={{ top: 20, right: 20, bottom: windowWidth < 768 ? 60 : 40, left: 60 }}
              />
            </div>
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

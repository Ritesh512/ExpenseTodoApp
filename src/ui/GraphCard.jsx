import React from 'react';
import styled from 'styled-components';
import Chart from 'react-apexcharts';

const Card = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  width: 100%;
  max-width: 450px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 16px;
    max-width: 100%;
  }
`;

const Title = styled.h4`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-grey-900);
`;

const FallbackMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--color-grey-400);
  font-size: 1.5rem;
`;

const GraphCard = ({ title, data, type }) => {
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const transformData = () => {
    if (!data || data.length === 0) return null;

    const commonOptions = {
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
      },
      chart: {
        background: 'transparent',
        fontFamily: 'Poppins, sans-serif',
        toolbar: { show: false }
      },
      grid: {
        borderColor: 'var(--glass-border)',
        strokeDashArray: 4,
      }
    };

    if (type === 'donut') {
      return {
        options: {
          ...commonOptions,
          labels: data.map((item) => item.category),
          legend: { labels: { colors: 'var(--color-grey-600)' } }
        },
        series: data.map((item) => item.amount),
      };
    }

    if (type === 'bar') {
      const seriesData = data.map((item) => item.amount);
      if (seriesData.some((amount) => isNaN(amount))) return null;

      return {
        options: {
          ...commonOptions,
          xaxis: {
            categories: data.map((item) => item.item),
            labels: { style: { colors: 'var(--color-grey-500)' } }
          },
          yaxis: {
            labels: { 
              style: { colors: 'var(--color-grey-500)' },
              formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
            }
          }
        },
        series: [{ name: 'Spending', data: seriesData }],
      };
    }

    if (type === 'line') {
      return {
        options: {
          ...commonOptions,
          xaxis: {
            categories: data.map((item) => item.date),
            labels: { style: { colors: 'var(--color-grey-500)' } }
          },
          yaxis: {
            labels: { 
              style: { colors: 'var(--color-grey-500)' },
              formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
            }
          }
        },
        series: [{ name: 'Spending', data: data.map((item) => item.amount) }],
      };
    }
    return null;
  };

  const chartData = transformData();

  return (
    <Card>
      <Title>{title}</Title>
      {chartData ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type={type}
          width="100%"  // Ensure the chart width is responsive
        />
      ) : (
        <FallbackMessage>No data available</FallbackMessage>
      )}
    </Card>
  );
};

export default GraphCard;

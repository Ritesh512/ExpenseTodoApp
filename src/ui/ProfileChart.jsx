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
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileChart = ({ title, data = [], type }) => {
  // Determine current theme from document attribute
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const transformData = () => {
    if (!data.length) return null;

    const commonOptions = {
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
        palette: 'palette1'
      },
      chart: {
        background: 'transparent',
        fontFamily: 'Poppins, sans-serif',
        toolbar: { show: false }
      },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'],
      stroke: {
        show: true,
        width: 2,
        colors: [isDarkMode ? 'var(--color-grey-0)' : '#fff']
      },
      grid: {
        borderColor: 'var(--glass-border)',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light',
      }
    };

    if (type === 'donut') {
      return {
        options: {
          ...commonOptions,
          labels: data.map((item) => item.category),
          plotOptions: {
            pie: {
              donut: {
                size: '75%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Total',
                    color: 'var(--color-grey-600)',
                    formatter: (w) => {
                      const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                      return `₹${total.toLocaleString()}`;
                    }
                  }
                }
              },
            },
          },
          dataLabels: { enabled: false },
          legend: {
            position: 'bottom',
            fontSize: '12px',
            labels: { colors: 'var(--color-grey-600)' }
          }
        },
        series: data.map((item) => parseFloat(item.amount || item.percentage)),
      };
    } else if (type === 'bar') {
      return {
        options: {
          ...commonOptions,
          xaxis: {
            categories: data.map((item) => item.month || item.category),
            labels: { style: { colors: 'var(--color-grey-500)' } }
          },
          yaxis: {
            labels: { 
              style: { colors: 'var(--color-grey-500)' },
              formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val
            }
          },
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: '45%',
            }
          },
          dataLabels: { enabled: false }
        },
        series: [
          {
            name: 'Amount',
            data: data.map((item) => item.total || item.amount),
          },
        ],
      };
    }
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
          width="100%" 
          height={280}
        />
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--color-grey-400)', padding: '40px' }}>
          No data available
        </div>
      )}
    </Card>
  );
};

export default ProfileChart;

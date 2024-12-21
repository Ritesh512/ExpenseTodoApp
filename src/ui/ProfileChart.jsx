import React from 'react';
import styled from 'styled-components';
import Chart from 'react-apexcharts';

const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px;
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

const FallbackMessage = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ProfileChart = ({ title, data = [], type }) => {
  const transformData = () => {
    if (!data.length) return null; // Handle empty data

    if (type === 'donut') {
      // Pie Chart (Donut)
      return {
        options: {
          labels: data.map((item) => item.category),
          plotOptions: {
            pie: {
              donut: {
                size: '70%',
              },
            },
          },
        },
        series: data.map((item) => parseFloat(item.percentage)),
      };
    } else if (type === 'bar') {
      // Bar Chart
      return {
        options: {
          xaxis: {
            categories: data.map((item) => item.category),
          },
          yaxis: {
            title: {
              text: 'Amount (₹)',
            },
            labels: {
              formatter: function (value) {
                if (value >= 100000) {
                  return (value / 100000).toFixed(2) + 'L';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(2) + 'k';
                } else {
                  return value.toFixed(1);
                }
              },
            },
          },
        },
        series: [
          {
            name: 'Amount',
            data: data.map((item) => item.amount),
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
          height="auto" // Ensure responsive height
        />
      ) : (
        <FallbackMessage>No data available</FallbackMessage>
      )}
    </Card>
  );
};

export default ProfileChart;

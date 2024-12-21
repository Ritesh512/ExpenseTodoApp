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
    max-width: 90%;  // Allow card to take up more space on tablets
  }

  @media (max-width: 480px) {
    max-width: 100%;  // Full width on smaller screens
    padding: 15px;
  }
`;

const Title = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;  // Adjust font size for tablets
  }

  @media (max-width: 480px) {
    font-size: 14px;  // Adjust font size for small screens
  }
`;

const FallbackMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;

  @media (max-width: 480px) {
    padding: 15px;  // Adjust padding for mobile devices
  }
`;

const GraphCard = ({ title, data, type }) => {
  const transformData = () => {
    if (!data || data.length === 0) return null; // Handle empty data

    if (type === 'donut') {
      return {
        options: {
          labels: data.map((item) => item.category),
        },
        series: data.map((item) => item.amount),
      };
    }

    if (type === 'bar') {
      const seriesData = data.map((item) => item.amount);
      // Check for invalid values
      if (seriesData.some((amount) => isNaN(amount))) {
        console.warn('Invalid data detected');
        return null;
      }

      return {
        options: {
          xaxis: {
            categories: data.map((item) => item.item),
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                if (value >= 100000) {
                  return (value / 100000).toFixed(2) + 'L';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(2) + 'k';
                } else {
                  return value.toFixed(2);
                }
              },
            },
          },
        },
        series: [
          {
            name: 'Spending',
            data: seriesData,
          },
        ],
      };
    }

    if (type === 'line') {
      return {
        options: {
          xaxis: {
            categories: data.map((item) => item.date), // X-axis categories (e.g., dates)
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                if (value >= 100000) {
                  return (value / 100000).toFixed(2) + 'L';
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(2) + 'k';
                } else {
                  return value.toFixed(2);
                }
              },
            },
          },
        },
        series: [
          {
            name: 'Spending', // Label for the line chart series
            data: data.map((item) => item.amount), // Series data (spending amounts)
          },
        ],
      };
    }

    return {
      options: {},
      series: [],
    };
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

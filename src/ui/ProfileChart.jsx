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
`;

const Title = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
`;

const FallbackMessage = styled.div`
  text-align: center;
  color: #888;
  padding: 20px;
  font-size: 16px;
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
    }

    if (type === 'bar') {
      // Bar Chart
      const seriesData = data.map((item) => item.amount);
      return {
        options: {
          chart: {
            type: 'bar',
            height: 350,
          },
          xaxis: {
            categories: data.map((item) => item.category),
            title: {
              text: 'Categories',
            },
          },
          yaxis: {
            title: {
              text: 'Amount ($)',
            },
          },
          title: {
            text: 'Spending by Category',
            align: 'center',
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            },
          },
        },
        series: [
          {
            name: 'Amount',
            data: seriesData,
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
        <Chart options={chartData.options} series={chartData.series} type={type} width="100%" />
      ) : (
        <FallbackMessage>No data available</FallbackMessage>
      )}
    </Card>
  );
};

export default ProfileChart;

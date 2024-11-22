import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";
import Summary from "../ui/Summary";
import { toast } from 'react-toastify';

const CompareContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Dropdown = styled.select`
  width: 200px;
  padding: 10px;
  margin: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #ffffff; /* White background for the card */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  width: 450px; /* Width of the card */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChartTitle = styled.h4`
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333; /* Darker text for the title */
`;

const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const Compare = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index (0 = January, 11 = December)
  const currentYear = currentDate.getFullYear(); // e.g., 2024

  const [month1, setMonth1] = useState(months[currentMonth]);
  const [year1, setYear1] = useState(String(currentYear));
  const [month2, setMonth2] = useState(months[currentMonth]);
  const [year2, setYear2] = useState(String(currentYear));
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);

  useEffect(() => {
    fetchData();
  }, [month1, year1, month2, year2]);

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await fetch(
        `http://localhost:3000/api/expenses/filter/two-months?month1=${month1.value}&year1=${year1}&month2=${month2.value}&year2=${year2}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setChartData1(data.mon1);
      setChartData2(data.mon2);
    } catch (error) {
      toast.warning("Error in fetching data", {
        position: "top-right",
      });
    }
  };

  const prepareChartData = (data) => {
    const labels = data.map((item) => item.expenseType);
    const series = data.map((item) => item.amount);
    return { labels, series };
  };

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: [],
    dataLabels: {
      enabled: true,
    },
    colors: [
      "#00E396", // Green (Custom)
      "#FEB019", // Orange (Retail)
      "#FF4560", // Red (Electronic)
      "#775DD0", // Purple (Food)
      "#008FFB", // Blue (Travel)
      "#00D9E9", // Teal (Utilities)
      "#FF66C3", // Pink (Other)
      "#D4AC2B"  // Gold (Extra Type)
    ],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          gradient: {
            enabled: true,
          },
        },
      },
    },
  };

  const computeSummary = () => {
    const total1 = chartData1.reduce((sum, item) => sum + item.amount, 0);
    const total2 = chartData2.reduce((sum, item) => sum + item.amount, 0);

    const differences = [
      ...chartData1.map((item) => {
        const match = chartData2.find((data) => data.expenseType === item.expenseType);
        return {
          expenseType: item.expenseType,
          amountDiff: match ? match.amount - item.amount : -item.amount,
        };
      }),
      ...chartData2
        .filter((item) => !chartData1.find((data) => data.expenseType === item.expenseType))
        .map((item) => ({
          expenseType: item.expenseType,
          amountDiff: item.amount,
        })),
    ];

    const topExpenseDiff = differences.reduce(
      (prev, curr) =>
        Math.abs(curr.amountDiff) > Math.abs(prev.amountDiff) ? curr : prev,
      { expenseType: "None", amountDiff: 0 }
    );

    return {
      total1,
      total2,
      topExpenseDiff,
    };
  };





  return (
    <CompareContainer>
      {/* <h1>Compare Expenses</h1> */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h3>Chart 1</h3>
          <Dropdown
            value={month1.value}
            onChange={(e) => {
              const selectedMonth = months.find(
                (month) => month.value === parseInt(e.target.value)
              );
              setMonth1(selectedMonth);
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={year1}
            onChange={(e) => setYear1(parseInt(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const yearOption = currentYear - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </Dropdown>
        </div>
        <div>
          <h3>Chart 2</h3>
          <Dropdown
            value={month2.value}
            onChange={(e) => {
              const selectedMonth = months.find(
                (month) => month.value === parseInt(e.target.value)
              );
              setMonth2(selectedMonth);
            }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={year2}
            onChange={(e) => setYear2(parseInt(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const currentYear = new Date().getFullYear();
              const yearOption = currentYear - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </Dropdown>

        </div>
      </div>

      <ChartContainer>
        <Card>
          <div>
            <ChartTitle>{month1.name}</ChartTitle>
            {
              chartData1.length === 0 ?
                <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No data available
                </div>
                :
                <Chart
                  options={{ ...chartOptions, labels: prepareChartData(chartData1).labels }}
                  series={prepareChartData(chartData1).series}
                  type="donut"
                  width="400"
                />
            }

          </div>
        </Card>
        <Card>
          <div>
            <ChartTitle>{month2.name}</ChartTitle>
            {
              chartData2.length === 0 ?
                <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No data available
                </div>
                :
                <Chart
                  options={{ ...chartOptions, labels: prepareChartData(chartData2).labels }}
                  series={prepareChartData(chartData2).series}
                  type="donut"
                  width="400"
                />
            }

          </div>
        </Card>
      </ChartContainer>

      {
        chartData2.length > 0 && <Summary summary={computeSummary()} month1Name={month1.name} month2Name={month2.name} />
      }

    </CompareContainer>
  );
};

export default Compare;

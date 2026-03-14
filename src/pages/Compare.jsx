import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";
import Summary from "../ui/Summary";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import checkAuth from "../api/checkauth";

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
  const currentMonth = currentDate.getMonth(); // 0-based index
  const currentYear = currentDate.getFullYear(); // current year

  const [month1, setMonth1] = useState(months[currentMonth]);
  const [year1, setYear1] = useState(String(currentYear));
  const [month2, setMonth2] = useState(months[currentMonth]);
  const [year2, setYear2] = useState(String(currentYear));
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [month1, year1, month2, year2]);

  // Handle window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://expense-todo-five.vercel.app/api/expenses/filter/two-months?month1=${month1.value}&year1=${year1}&month2=${month2.value}&year2=${year2}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        },
      );
      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }
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
      style: {
        fontSize: "12px",
      },
      dropShadow: {
        enabled: false,
      },
    },
    colors: [
      "#00E396", // Green
      "#FEB019", // Orange
      "#FF4560", // Red
      "#775DD0", // Purple
      "#008FFB", // Blue
      "#00D9E9", // Teal
      "#FF66C3", // Pink
      "#D4AC2B", // Gold
    ],
    legend: {
      position: "bottom",
      fontSize: "12px",
      markers: {
        width: 8,
        height: 8,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: false, // Hide center labels to save space
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768, // Tablet breakpoint
        options: {
          legend: {
            position: "bottom",
            fontSize: "11px",
            itemMargin: {
              horizontal: 6,
              vertical: 3,
            },
          },
          dataLabels: {
            enabled: false, // Disable data labels on tablet to prevent overflow
          },
          plotOptions: {
            pie: {
              donut: {
                size: "70%", // Slightly smaller donut
              },
            },
          },
        },
      },
      {
        breakpoint: 480, // Mobile breakpoint
        options: {
          legend: {
            position: "bottom",
            fontSize: "10px",
            itemMargin: {
              horizontal: 4,
              vertical: 2,
            },
          },
          dataLabels: {
            enabled: false, // Disable data labels on mobile
          },
          plotOptions: {
            pie: {
              donut: {
                size: "65%", // Smaller donut for mobile
              },
            },
          },
        },
      },
    ],
  };

  const computeSummary = () => {
    const total1 = chartData1.reduce((sum, item) => sum + item.amount, 0);
    const total2 = chartData2.reduce((sum, item) => sum + item.amount, 0);

    // Calculate category differences
    const categoryDifferences = [
      ...chartData1.map((item) => {
        const match = chartData2.find(
          (data) => data.expenseType === item.expenseType,
        );
        return {
          expenseType: item.expenseType,
          amount1: item.amount,
          amount2: match ? match.amount : 0,
          difference: match ? match.amount - item.amount : -item.amount,
        };
      }),
      ...chartData2
        .filter(
          (item) =>
            !chartData1.find((data) => data.expenseType === item.expenseType),
        )
        .map((item) => ({
          expenseType: item.expenseType,
          amount1: 0,
          amount2: item.amount,
          difference: item.amount,
        })),
    ].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference)); // Sort by absolute difference

    const topExpenseDiff =
      categoryDifferences.length > 0
        ? categoryDifferences[0]
        : {
            expenseType: "None",
            difference: 0,
            amount1: 0,
            amount2: 0,
          };

    // Calculate additional metrics
    const categoryCount1 = chartData1.length;
    const categoryCount2 = chartData2.length;

    return {
      total1,
      total2,
      topExpenseDiff: {
        expenseType: topExpenseDiff.expenseType,
        amountDiff: topExpenseDiff.difference,
        amount1: topExpenseDiff.amount1,
        amount2: topExpenseDiff.amount2,
      },
      categoryDifferences: categoryDifferences.slice(0, 5), // Top 5 category differences
      categoryCount1,
      categoryCount2,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-0 py-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 mt-2 gap-3">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          Expense Comparison
        </h1>
      </div>

      {/* SELECTORS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* MONTH 1 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Chart 1
          </h3>

          <div className="flex gap-3 flex-wrap">
            <select
              className="input"
              value={month1.value}
              onChange={(e) => {
                const selectedMonth = months.find(
                  (m) => m.value === parseInt(e.target.value),
                );
                setMonth1(selectedMonth);
              }}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={year1}
              onChange={(e) => setYear1(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const yearOption = new Date().getFullYear() - i;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* MONTH 2 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Chart 2
          </h3>

          <div className="flex gap-3 flex-wrap">
            <select
              className="input"
              value={month2.value}
              onChange={(e) => {
                const selectedMonth = months.find(
                  (m) => m.value === parseInt(e.target.value),
                );
                setMonth2(selectedMonth);
              }}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={year2}
              onChange={(e) => setYear2(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const yearOption = new Date().getFullYear() - i;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CHART 1 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col items-center">
          <h4 className="text-sm font-medium mb-4 text-[var(--text-primary)]">
            {month1.name} {year1}
          </h4>

          {chartData1.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">
              No data available
            </p>
          ) : (
            <Chart
              options={{
                ...chartOptions,
                labels: prepareChartData(chartData1).labels,
              }}
              series={prepareChartData(chartData1).series}
              type="donut"
              width="100%"
              height="320"
            />
          )}
        </div>

        {/* CHART 2 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col items-center">
          <h4 className="text-sm font-medium mb-4 text-[var(--text-primary)]">
            {month2.name} {year2}
          </h4>

          {chartData2.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">
              No data available
            </p>
          ) : (
            <Chart
              options={{
                ...chartOptions,
                labels: prepareChartData(chartData2).labels,
              }}
              series={prepareChartData(chartData2).series}
              type="donut"
              width="100%"
              height="320"
            />
          )}
        </div>
      </div>

      {/* SUMMARY */}
      {chartData2.length > 0 && (
        <div className="mt-6">
          <Summary
            summary={computeSummary()}
            month1Name={month1.name}
            month2Name={month2.name}
            year1={year1}
            year2={year2}
          />
        </div>
      )}

      {/* INPUT STYLE */}
      <style jsx>{`
        .input {
          padding: 6px 10px;
          font-size: 13px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-primary);
          outline: none;
          min-width: 120px;
        }

        .input:focus {
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default Compare;

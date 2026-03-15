import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: "Expense Distribution",
        data: data.map((item) => item.percentage),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f43f5e",
          "#f59e0b",
          "#10b981",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="rounded-xl border shadow-md p-6"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;

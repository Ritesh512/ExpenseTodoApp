import React from "react";
import Chart from "react-apexcharts";

const ProfileChart = ({ title, data = [], type }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const transformData = () => {
    if (!data.length) return null;

    const commonOptions = {
      theme: {
        mode: isDark ? "dark" : "light",
      },
      chart: {
        background: "transparent",
        toolbar: { show: false },
        fontFamily: "Inter, sans-serif",
      },
      colors: [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f43f5e",
        "#f59e0b",
        "#10b981",
        "#06b6d4",
      ],
      grid: {
        borderColor: "var(--border-color)",
        strokeDashArray: 4,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
      },
    };

    if (type === "donut") {
      return {
        options: {
          ...commonOptions,
          labels: data.map((item) => item.category),

          plotOptions: {
            pie: {
              donut: {
                size: "70%",
                labels: {
                  show: false, // removes center total
                },
              },
            },
          },

          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return `${val.toFixed(0)}%`;
            },
            style: {
              fontSize: "12px",
              fontWeight: "400",
            },
          },

          legend: {
            position: "bottom",
            labels: {
              colors: "var(--text-secondary)",
            },
          },
        },

        series: data.map((item) => parseFloat(item.amount || item.percentage)),
      };
    }

    if (type === "bar") {
      return {
        options: {
          ...commonOptions,
          xaxis: {
            categories: data.map((item) => item.month || item.category),
            labels: {
              style: { colors: "var(--text-secondary)" },
            },
          },
          yaxis: {
            labels: {
              style: { colors: "var(--text-secondary)" },
              formatter: (val) =>
                val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val,
            },
          },
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: "45%",
            },
          },
          dataLabels: { enabled: false },
        },
        series: [
          {
            name: "Amount",
            data: data.map((item) => item.total || item.amount),
          },
        ],
      };
    }
  };

  const chartData = transformData();

  return (
    <div
      className="w-full max-w-[450px] rounded-xl p-6 transition
  shadow-[0_18px_40px_rgba(0,0,0,0.30)]
  hover:shadow-[0_26px_60px_rgba(0,0,0,0.40)]"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h4
        className="text-lg font-bold mb-6 flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h4>

      {chartData ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type={type}
          width="100%"
          height={280}
        />
      ) : (
        <div
          className="text-center py-10"
          style={{ color: "var(--text-secondary)" }}
        >
          No data available
        </div>
      )}
    </div>
  );
};

export default ProfileChart;

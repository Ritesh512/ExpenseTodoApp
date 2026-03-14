import React from "react";
import Chart from "react-apexcharts";

const GraphCard = ({ title, data, type }) => {
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";

  const transformData = () => {
    if (!data || data.length === 0) return null;

    const commonOptions = {
      chart: {
        background: "transparent",
        fontFamily: "Poppins, sans-serif",
        toolbar: { show: false },
      },

      theme: {
        mode: isDarkMode ? "dark" : "light",
      },

      grid: {
        borderColor: "var(--border-color)",
        strokeDashArray: 4,
      },

      legend: {
        labels: {
          colors: "var(--text-primary)",
        },
      },

      tooltip: {
        theme: isDarkMode ? "dark" : "light",
      },
    };

    if (type === "donut") {
      return {
        options: {
          ...commonOptions,
          labels: data.map((item) => item.category),
        },
        series: data.map((item) => item.amount),
      };
    }

    if (type === "bar") {
      const seriesData = data.map((item) => Number(item.amount));

      if (seriesData.some((v) => isNaN(v))) return null;

      return {
        options: {
          ...commonOptions,

          xaxis: {
            categories: data.map((item) => item.item),
            labels: {
              style: {
                colors: "var(--text-primary)",
                fontSize: "11px",
              },
            },
          },

          yaxis: {
            labels: {
              style: {
                colors: "var(--text-primary)",
                fontSize: "11px",
              },
              formatter: (val) =>
                val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val,
            },
          },
        },

        series: [
          {
            name: "Spending",
            data: seriesData,
          },
        ],
      };
    }

    if (type === "line") {
      return {
        options: {
          ...commonOptions,

          xaxis: {
            categories: data.map((item) => item.date),
            labels: {
              style: {
                colors: "var(--text-primary)",
                fontSize: "11px",
              },
            },
          },

          yaxis: {
            labels: {
              style: {
                colors: "var(--text-primary)",
                fontSize: "11px",
              },
              formatter: (val) =>
                val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val,
            },
          },
        },

        series: [
          {
            name: "Spending",
            data: data.map((item) => item.amount),
          },
        ],
      };
    }

    return null;
  };

  const chartData = transformData();

  return (
    <div
      className="
        bg-[var(--bg-surface)]
        border border-[var(--border-color)]
        rounded-lg
        shadow-sm
        p-4
        w-full
        transition
        hover:shadow-md
        hover:-translate-y-[2px]
      "
    >
      <h4
        className="
          text-sm
          font-semibold
          text-[var(--text-primary)]
          mb-3
        "
      >
        {title}
      </h4>

      {chartData ? (
        <div className="w-full overflow-hidden">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type={type}
            width="100%"
            height={280}
          />
        </div>
      ) : (
        <div
          className="
            text-center
            py-8
            text-sm
            text-[var(--text-secondary)]
          "
        >
          No data available
        </div>
      )}
    </div>
  );
};

export default GraphCard;

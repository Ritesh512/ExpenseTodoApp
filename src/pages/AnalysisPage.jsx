import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  getCategoryBreakdown,
  getSpendingTrends,
  getTopExpenses,
  getLowExpenses,
} from "../api/analysis";
import GraphCard from "../ui/GraphCard";
import Filters from "../ui/Filters";
import { useNavigate } from "react-router-dom";

const AnalysisPage = () => {
  const navigate = useNavigate();

  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [spendingTrends, setSpendingTrends] = useState({
    xData: [],
    yData: [],
  });
  const [topExpenses, setTopExpenses] = useState([]);
  const [lowExpenses, setLowExpenses] = useState([]);
  const [activePreset, setActivePreset] = useState("thisMonth");
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    return { startDate: startOfMonth, endDate: endOfMonth };
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setActivePreset("custom");
  };

  const applyDatePreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case "last7days":
        startDate = new Date(today.getTime() - 7 * 86400000);
        endDate = today;
        break;
      case "last30days":
        startDate = new Date(today.getTime() - 30 * 86400000);
        endDate = today;
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return;
    }

    const newFilters = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };

    setFilters(newFilters);
    setActivePreset(preset);
  };

  const calculateSummaryMetrics = () => {
    const totalSpending = categoryBreakdown?.totalSpending || 0;

    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    const daysDiff =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const avgDailySpending =
      daysDiff > 0 ? (totalSpending / daysDiff).toFixed(2) : "0.00";

    const topCategory =
      categoryBreakdown?.categoryBreakdown?.length > 0
        ? categoryBreakdown.categoryBreakdown.reduce((prev, current) =>
            prev.amount > current.amount ? prev : current,
          )
        : null;

    return {
      totalSpending,
      avgDailySpending,
      topCategory: topCategory?.category || "N/A",
      dataPoints: spendingTrends.yData?.length || 0,
    };
  };

  const summaryMetrics = calculateSummaryMetrics();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");

        const categoryData = await getCategoryBreakdown(filters);
        setCategoryBreakdown(categoryData || {});

        const trendData = await getSpendingTrends({
          ...filters,
          interval: "daily",
        });

        const weeklyData = {};

        trendData.spendingTrends.forEach((entry) => {
          const date = new Date(entry.date);
          const weekNum = Math.ceil(date.getDate() / 7);

          const key = `${date.getFullYear()}-${date.getMonth()}-${weekNum}`;

          if (!weeklyData[key]) {
            weeklyData[key] = {
              weekNum,
              month: date.toLocaleDateString("en-US", { month: "short" }),
              total: 0,
            };
          }

          weeklyData[key].total += Number(entry.amount) || 0;
        });

        const xData = Object.values(weeklyData).map(
          (week) => `Week ${week.weekNum} (${week.month})`,
        );

        const yData = Object.values(weeklyData).map((week) => week.total);

        setSpendingTrends({ xData, yData });

        const topExpensesData = await getTopExpenses(filters);
        setTopExpenses(topExpensesData || []);

        const lowExpensesData = await getLowExpenses(filters);
        setLowExpenses(lowExpensesData || []);
      } catch (err) {
        console.error(err);

        if (
          err.message.includes("Authentication") ||
          err.message.includes("token")
        ) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to fetch analysis data.");
        }
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-5">
      {/* PRESET FILTERS */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            ["last7days", "Last 7 Days"],
            ["last30days", "Last 30 Days"],
            ["thisMonth", "This Month"],
            ["lastMonth", "Last Month"],
            ["thisYear", "This Year"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => applyDatePreset(key)}
              className={`px-3 py-1.5 text-xs rounded-md border transition
                ${
                  activePreset === key
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-color)]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Filters setFilters={handleFilterChange} currentFilters={filters} />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="metric-card">
          <div className="metric-value">
            ₹{summaryMetrics.totalSpending.toLocaleString("en-IN")}
          </div>
          <div className="metric-label">Total Spending</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">₹{summaryMetrics.avgDailySpending}</div>
          <div className="metric-label">Avg Daily Spending</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{summaryMetrics.topCategory}</div>
          <div className="metric-label">Top Category</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{summaryMetrics.dataPoints}</div>
          <div className="metric-label">Data Points</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="chart-card">
          <GraphCard
            title="Category Breakdown"
            data={categoryBreakdown?.categoryBreakdown || []}
            type="donut"
          />
        </div>

        <div className="chart-card flex flex-col items-center">
          <h4 className="chart-title">Weekly Spending Trends</h4>

          {spendingTrends?.xData?.length ? (
            <LineChart
              xAxis={[
                {
                  data: spendingTrends.xData,
                  scaleType: "band",
                  tickLabelStyle: {
                    fill: "var(--text-primary)",
                    fontSize: 11,
                  },
                },
              ]}
              yAxis={[
                {
                  tickLabelStyle: {
                    fill: "var(--text-primary)",
                    fontSize: 11,
                  },
                  valueFormatter: (v) =>
                    `₹${Number(v).toLocaleString("en-IN")}`,
                },
              ]}
              series={[
                {
                  data: spendingTrends.yData,
                  color: "#818cf8",
                },
              ]}
              height={280}
              grid={{ vertical: true, horizontal: true }}
              sx={{
                /* axis text */
                "& .MuiChartsAxis-tickLabel": {
                  fill: "var(--text-primary) !important",
                },

                /* legend text */
                "& .MuiChartsLegend-root text": {
                  fill: "var(--text-primary) !important",
                },

                /* axis lines */
                "& .MuiChartsAxis-line": {
                  stroke: "var(--border-color)",
                },

                /* ticks */
                "& .MuiChartsAxis-tick": {
                  stroke: "var(--border-color)",
                },

                /* grid lines */
                "& .MuiChartsGrid-line": {
                  stroke: "var(--border-color)",
                },
              }}
            />
          ) : (
            <p className="text-xs text-[var(--text-secondary)] py-8">
              No data available
            </p>
          )}
        </div>

        <div className="chart-card">
          <GraphCard
            title="Top Expenses"
            data={topExpenses.topExpenses || []}
            type="bar"
          />
        </div>

        <div className="chart-card">
          <GraphCard
            title="Low Expenses"
            data={lowExpenses.lowestExpenses || []}
            type="bar"
          />
        </div>
      </div>

      <style jsx>{`
        .metric-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-left: 4px solid #6366f1;
          border-radius: 8px;
          padding: 12px;
          text-align: center;
        }

        .metric-value {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .metric-label {
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .chart-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 14px;
          width: 100%;
        }

        .chart-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default AnalysisPage;

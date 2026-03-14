import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import {
  getAIAnalysis,
  getAIRecommendations,
  getAIForecast,
} from "../api/analysis";
import { FaSpinner } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AIInsights = ({ dateRange, month, year }) => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [analysis, setAnalysis] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRateLimit, setIsRateLimit] = useState(false);

  useEffect(() => {
    fetchData("analysis");
  }, []);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    setIsRateLimit(false);

    try {
      if (tab === "analysis") {
        const data = await getAIAnalysis(
          dateRange.startDate,
          dateRange.endDate,
        );
        setAnalysis(data);
      }

      if (tab === "recommendations") {
        const data = await getAIRecommendations(month, year);
        setRecommend(data);
      }

      if (tab === "forecast") {
        const data = await getAIForecast(2);
        setForecast(data);
      }
    } catch (err) {
      const limited =
        err.message.includes("rate limit") ||
        err.message.includes("Too many requests");

      setIsRateLimit(limited);
      setError(err.message);
      toast.error(err.message);
    }

    setLoading(false);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    fetchData(tab);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* TABS */}
      <div className="flex justify-between items-center p-0 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md overflow-x-auto">
        {[
          ["analysis", "📊 Analysis"],
          ["recommendations", "💡 Recommendations"],
          ["forecast", "🔮 Forecast"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => changeTab(key)}
            className={`flex-1 text-center px-2 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition
      ${
        activeTab === key
          ? "bg-indigo-500 text-white"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
      }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-4">
        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center py-10 gap-4">
            <FaSpinner className="animate-spin text-indigo-500 text-3xl" />
            <p className="text-sm text-[var(--text-secondary)]">
              Loading AI insights...
            </p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            className={`p-4 rounded-md border text-sm ${
              isRateLimit
                ? "border-yellow-400 text-yellow-600"
                : "border-red-400 text-red-500"
            }`}
          >
            {error}
          </div>
        )}

        {/* ANALYSIS */}
        {!loading && activeTab === "analysis" && analysis && (
          <>
            <h3 className="section-title">Period Analysis</h3>

            <div className="grid gap-3 sm:grid-cols-3 mb-5">
              <div className="summary-card">
                <span>Total Spending</span>
                <strong>
                  ₹{analysis.summary.totalSpending.toLocaleString()}
                </strong>
              </div>

              <div className="summary-card">
                <span>Transactions</span>
                <strong>{analysis.summary.transactions}</strong>
              </div>

              <div className="summary-card">
                <span>Avg Transaction</span>
                <strong>
                  ₹{analysis.summary.avgTransaction.toLocaleString()}
                </strong>
              </div>
            </div>

            <h3 className="section-title">Category Breakdown</h3>

            <div className="flex flex-col gap-3">
              {analysis.categoryBreakdown.slice(0, 10).map((c, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-3"
                >
                  <div className="flex justify-between text-sm font-medium text-[var(--text-primary)]">
                    <span>{c.category}</span>
                    <span>₹{c.amount.toLocaleString()}</span>
                  </div>

                  <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>

                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {c.percentage}%
                  </div>
                </div>
              ))}
            </div>

            <h3 className="section-title">Top Expenses</h3>

            <div className="flex flex-col gap-2">
              {analysis.topExpenses?.map((e, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-3 text-sm"
                >
                  <span>{e.name}</span>
                  <span className="font-semibold text-indigo-500">
                    ₹{e.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="section-title">AI Analysis</h3>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg p-4 text-sm leading-relaxed">
              <ReactMarkdown>{analysis.aiAnalysis}</ReactMarkdown>
            </div>
          </>
        )}

        {/* RECOMMENDATIONS */}
        {!loading && activeTab === "recommendations" && recommend && (
          <>
            <h3 className="section-title">Monthly Recommendations</h3>

            <div className="grid gap-3 sm:grid-cols-2 mb-5">
              <div className="summary-card">
                <span>Month</span>
                <strong>{recommend.month}</strong>
              </div>

              <div className="summary-card">
                <span>Total Spending</span>
                <strong>₹{recommend.monthlySpending.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg p-4 text-sm">
              <ReactMarkdown>{recommend.aiRecommendations}</ReactMarkdown>
            </div>
          </>
        )}

        {/* FORECAST */}
        {!loading && activeTab === "forecast" && forecast && (
          <>
            <h3 className="section-title">Spending Trend</h3>

            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={forecast.historicalData}>
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>

            <h3 className="section-title">AI Forecast</h3>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg p-4 text-sm">
              <ReactMarkdown>{forecast.aiForecast}</ReactMarkdown>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .section-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .summary-card {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          padding: 12px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
        }

        .summary-card span {
          font-size: 11px;
          opacity: 0.8;
        }

        .summary-card strong {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default AIInsights;

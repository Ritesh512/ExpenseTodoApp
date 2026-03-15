import React, { useState } from "react";
import AIInsights from "../ui/AIInsights";

const AIInsightsPage = () => {
  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [dateRange] = useState({
    startDate: startOfMonth,
    endDate: endOfMonth,
  });

  const [month] = useState(today.getMonth() + 1);
  const [year] = useState(today.getFullYear());

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex justify-center px-4 py-2">
      <div className="w-full max-w-5xl flex flex-col gap-5">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            🤖 AI Insights
          </h1>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            AI-powered analysis, recommendations, and spending forecasts
          </p>
        </div>

        <AIInsights dateRange={dateRange} month={month} year={year} />
      </div>
    </div>
  );
};

export default AIInsightsPage;

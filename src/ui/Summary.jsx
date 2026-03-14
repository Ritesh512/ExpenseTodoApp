import React from "react";

const Summary = ({ summary, month1Name, month2Name, year1, year2 }) => {
  const { total1, total2, topExpenseDiff, categoryDifferences = [] } = summary;
  const { expenseType, amountDiff } = topExpenseDiff;

  const difference = total2 - total1;
  const percentChange =
    total1 > 0 ? ((difference / total1) * 100).toFixed(1) : 0;

  const isIncrease = difference > 0;

  const getDaysInMonth = (monthName) => {
    const monthMap = {
      January: 31,
      February: 28,
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };
    return monthMap[monthName] || 30;
  };

  const days1 = getDaysInMonth(month1Name);
  const days2 = getDaysInMonth(month2Name);

  const avgDaily1 = total1 / days1;
  const avgDaily2 = total2 / days2;
  const avgDailyDiff = avgDaily2 - avgDaily1;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-3 rounded-lg shadow-sm my-3 mb-12">
      {/* HEADER */}
      <h2 className="text-[var(--text-primary)] text-base text-center border-b border-[var(--border-color)] pb-1 mb-3">
        📊 {month1Name} {year1} vs {month2Name} {year2}
      </h2>

      {/* GRID */}
      <div className="grid gap-2 mb-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {/* TOTAL SPENDING */}
        <div className="bg-[var(--bg-main)] p-2 rounded-md border-l-4 border-blue-500">
          <h4 className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">
            Total Spending
          </h4>

          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {month1Name}: ₹{total1.toLocaleString("en-IN")}
          </div>

          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {month2Name}: ₹{total2.toLocaleString("en-IN")}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)]">
            Diff ₹{Math.abs(difference).toLocaleString("en-IN")}
            <span
              className={`ml-1 font-semibold ${
                isIncrease ? "text-green-500" : "text-red-500"
              }`}
            >
              ({isIncrease ? "+" : "-"}
              {percentChange}%)
            </span>
          </div>
        </div>

        {/* AVG DAILY */}
        <div className="bg-[var(--bg-main)] p-2 rounded-md border-l-4 border-red-500">
          <h4 className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">
            Daily Avg
          </h4>

          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {month1Name}: ₹{avgDaily1.toFixed(0)}
          </div>

          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {month2Name}: ₹{avgDaily2.toFixed(0)}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)]">
            {avgDailyDiff >= 0 ? "+" : ""}₹{avgDailyDiff.toFixed(0)}/day
          </div>
        </div>

        {/* TOP CATEGORY */}
        <div className="bg-[var(--bg-main)] p-2 rounded-md border-l-4 border-green-500">
          <h4 className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">
            Top Category
          </h4>

          <div className="text-sm font-semibold text-[var(--text-primary)] capitalize">
            {expenseType}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)]">
            {amountDiff >= 0 ? "+" : ""}₹
            {Math.abs(amountDiff).toLocaleString("en-IN")}
            <span
              className={`ml-1 font-semibold ${
                amountDiff > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {amountDiff > 0 ? "↑" : amountDiff < 0 ? "↓" : "→"}
            </span>
          </div>
        </div>

        {/* TREND */}
        <div className="bg-[var(--bg-main)] p-2 rounded-md border-l-4 border-yellow-500">
          <h4 className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">
            Trend
          </h4>

          <div
            className={`text-sm font-semibold ${
              isIncrease ? "text-red-500" : "text-green-500"
            }`}
          >
            {isIncrease ? "📈 Increased" : "📉 Decreased"}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)]">
            {isIncrease ? "Higher spending" : "Lower spending"}
          </div>
        </div>
      </div>

      {/* CATEGORY LIST */}
      {categoryDifferences.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
          <h4 className="text-[var(--text-primary)] text-sm font-semibold mb-2">
            📋 Category Changes
          </h4>

          <div className="grid gap-1 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {categoryDifferences.slice(0, 6).map((category, index) => {
              const percent =
                category.amount1 > 0
                  ? ((category.difference / category.amount1) * 100).toFixed(1)
                  : 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col px-2 py-1 rounded bg-[var(--bg-main)] border-l-4 ${
                    category.difference > 0
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[var(--text-primary)] capitalize">
                      {category.expenseType}
                    </span>

                    <span
                      className={`${
                        category.difference > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {category.difference >= 0 ? "+" : ""}₹
                      {Math.abs(category.difference).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>
                      {month1Name}: ₹{category.amount1}
                    </span>
                    <span>
                      {month2Name}: ₹{category.amount2}
                    </span>
                    <span>{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;

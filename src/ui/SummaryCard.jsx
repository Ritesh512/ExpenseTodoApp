import React from "react";

const SummaryCard = ({ totalSpending }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 rounded-lg shadow-md mb-2">
      <h3 className="text-sm font-semibold mb-1">Summary</h3>

      <p className="text-lg font-bold">
        ₹{totalSpending.toLocaleString("en-IN")}
      </p>

      <p className="text-xs opacity-80">Total Spending</p>
    </div>
  );
};

export default SummaryCard;

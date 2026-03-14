import React, { useState, useEffect } from "react";

const predefinedTypes = [
  "Retail",
  "Electronic",
  "Food",
  "Travel",
  "Utilities",
  "Gold",
  "SIP",
  "Medicine",
];

const ExpenseForm = ({ initialData = {}, onSubmit, submitButtonText }) => {
  const [expenseName, setExpenseName] = useState(initialData.expenseName || "");
  const [expenseType, setExpenseType] = useState(initialData.expenseType || "");
  const [customExpenseType, setCustomExpenseType] = useState("");

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(initialData.date || getTodayDate());
  const [issuedTo, setIssuedTo] = useState(initialData.issuedTo || "");
  const [amount, setAmount] = useState(initialData.amount || "");

  useEffect(() => {
    if (initialData._id) {
      setExpenseName(initialData.expenseName);

      if (
        initialData.expenseType &&
        !predefinedTypes.includes(initialData.expenseType)
      ) {
        setExpenseType("Other");
        setCustomExpenseType(initialData.expenseType);
      } else {
        setExpenseType(initialData.expenseType || "Retail");
      }

      setDate(initialData.date);
      setIssuedTo(initialData.issuedTo);
      setAmount(initialData.amount);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const rawType =
      expenseType === "Other" ? customExpenseType || "Other" : expenseType;

    const normalized = String(rawType).trim();

    const formattedType = normalized
      ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
      : "Other";

    const expenseData = {
      expenseName,
      expenseType: formattedType,
      date,
      issuedTo,
      amount,
    };

    onSubmit(expenseData);
  };

  return (
    <div
      className="w-full max-w-lg mx-auto p-4 sm:p-6 rounded-xl shadow-md"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Expense Name */}
        <FormField label="Expense Name">
          <Input
            type="text"
            placeholder="e.g. Monthly Grocery"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
        </FormField>

        {/* Category */}
        <FormField label="Category">
          <Input
            type="text"
            list="expense-types"
            placeholder="Select or type..."
            value={
              expenseType === "Other" && customExpenseType
                ? customExpenseType
                : expenseType
            }
            onChange={(e) => {
              const v = e.target.value;

              if (v === "Other") {
                setExpenseType("Other");
                setCustomExpenseType("");
              } else if (predefinedTypes.includes(v)) {
                setExpenseType(v);
                setCustomExpenseType("");
              } else {
                setExpenseType(v);
                setCustomExpenseType(v);
              }
            }}
          />

          <datalist id="expense-types">
            {predefinedTypes.map((type) => (
              <option key={type} value={type} />
            ))}
            <option value="Other" />
          </datalist>
        </FormField>

        {/* Date */}
        <FormField label="Date">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>

        {/* Issued To */}
        <FormField label="Issued To">
          <Input
            type="text"
            placeholder="e.g. Amazon, Local Shop"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
          />
        </FormField>

        {/* Amount */}
        <FormField label="Amount (₹)">
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormField>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
          style={{
            background: "var(--color-brand-500)",
          }}
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};

/* Reusable field wrapper */

const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label
      className="text-sm font-medium"
      style={{ color: "var(--text-secondary)" }}
    >
      {label}
    </label>
    {children}
  </div>
);

/* Reusable input */

const Input = (props) => (
  <input
    {...props}
    required
    className="w-full px-3 py-2 rounded-md text-sm border outline-none transition"
    style={{
      background: "var(--bg-main)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    }}
  />
);

export default ExpenseForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";

const AddExpense = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    expenseName: "",
    amount: "",
    expenseType: "",
    issuedTo: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://expense-todo-five.vercel.app/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      const isAuthValid = await checkAuth(res);
      if (!isAuthValid) return navigate("/login");

      if (!res.ok) throw new Error("Failed to add expense");

      toast.success("Expense added!");
      navigate("/expenses");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className=" bg-[var(--bg-main)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-semibold text-[var(--text-primary)]">
            Add Expense
          </h1>

          <span className="text-xs text-[var(--text-secondary)]">
            Quick entry
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="expenseName"
            placeholder="Expense name"
            value={form.expenseName}
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="expenseType"
            placeholder="Category"
            value={form.expenseType}
            onChange={handleChange}
            className="input"
          />

          <input
            name="issuedTo"
            placeholder="Issued to"
            value={form.issuedTo}
            onChange={handleChange}
            className="input"
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="input resize-none"
          />

          <button
            type="submit"
            className="
            mt-2
            bg-indigo-500
            text-white
            text-sm
            py-2
            rounded-md
            hover:bg-indigo-600
            transition
          "
          >
            Add Expense
          </button>
        </form>
      </div>

      {/* INPUT STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 6px 10px;
          font-size: 13px;
          height: 34px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--bg-main);
          color: var(--text-primary);
          outline: none;
          transition: border 0.15s ease;
        }

        textarea.input {
          height: auto;
          min-height: 60px;
          padding-top: 8px;
        }

        .input:focus {
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default AddExpense;

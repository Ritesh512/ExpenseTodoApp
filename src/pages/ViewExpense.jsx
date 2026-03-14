import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";
import {
  downloadExpensesPDF,
  downloadExpensesExcel,
} from "../utils/exportExpenses";

const ITEMS_PER_PAGE = 10;

const ViewExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
    fetchExpenses();
  }, [month, year]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const fetchExpenses = async () => {
    try {
      setError(null);

      const response = await fetch(
        `https://expense-todo-five.vercel.app/api/expenses/filter/month?month=${month}&year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error();

      const data = await response.json();
      setExpenses(data);
    } catch {
      setError("Failed to fetch expenses");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      const response = await fetch(
        `https://expense-todo-five.vercel.app/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        toast.success("Expense Deleted");
        setExpenses((prev) => prev.filter((e) => e._id !== id));
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  const categories = [...new Set(expenses.map((e) => e.expenseType))];

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      searchTerm === "" ||
      expense.expenseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.issuedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || expense.expenseType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0,
  );

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = filteredExpenses
    .slice()
    .reverse()
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-[var(--bg-main)] p-0 md:p-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow">
            Expenses - ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-3 mb-4 flex flex-col md:flex-row md:justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {/* MONTH */}
            <div className="flex items-center gap-1 border border-[var(--border-color)] px-2 py-1 rounded-md">
              <FaCalendarAlt className="text-xs text-gray-400" />

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option
                    key={i}
                    value={i + 1}
                    className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  >
                    {new Date(0, i).toLocaleString("default", {
                      month: "short",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* YEAR */}
            <div className="border border-[var(--border-color)] px-2 py-1 rounded-md">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option
                      key={y}
                      value={y}
                      className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                    >
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* CATEGORY */}
            <div className="flex items-center gap-1 border border-[var(--border-color)] px-2 py-1 rounded-md">
              <FaFilter className="text-xs text-gray-400" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none text-sm"
              >
                <option
                  value=""
                  className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                >
                  All
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat}
                    className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEARCH + EXPORT */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 border border-[var(--border-color)] px-2 py-1 rounded-md">
              <FaSearch className="text-xs text-gray-400" />

              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-sm w-28 text-[var(--text-primary)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => downloadExpensesPDF(filteredExpenses, month, year)}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              <FaFilePdf className="text-sm" />
            </button>

            <button
              onClick={() =>
                downloadExpensesExcel(filteredExpenses, month, year)
              }
              className="flex items-center justify-center w-8 h-8 rounded-md bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
            >
              <FaFileExcel className="text-sm" />
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-500 text-sm mb-3">{error}</div>
        )}

        {/* LIST */}
        <div className="space-y-2 max-h-[55vh] overflow-y-auto">
          {paginatedExpenses.length > 0 ? (
            paginatedExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:shadow-sm transition"
              >
                <div>
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    {expense.expenseName}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(expense.date).toLocaleDateString()} •{" "}
                    {expense.expenseType} • {expense.issuedTo}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-indigo-500">
                    ₹{expense.amount.toFixed(2)}
                  </span>

                  <button
                    onClick={() => handleEdit(expense._id)}
                    className="p-1.5 rounded-md hover:bg-indigo-100 text-indigo-600"
                  >
                    <FaEdit className="text-xs" />
                  </button>

                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="p-1.5 rounded-md hover:bg-red-100 text-red-600"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-[var(--text-secondary)] py-8">
              No expenses found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 mt-4 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 rounded border ${
                  currentPage === i + 1 ? "bg-indigo-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExpense;

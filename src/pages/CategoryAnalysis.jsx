import React, { useEffect, useMemo, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
    HiChevronDoubleDown,
    HiChevronDoubleUp,
} from "react-icons/hi2";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import {
    getCategories,
    searchExpenses,
    getSpendingTrends,
} from "../api/analysis";
import { useNavigate } from "react-router-dom";

const CategoryAnalysis = () => {
    const navigate = useNavigate();

    const getDefaultDates = () => {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

        return {
            startDate: startDate.toISOString().split("T")[0],
            endDate: today.toISOString().split("T")[0],
        };
    };

    const [dates, setDates] = useState(getDefaultDates);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const [expenses, setExpenses] = useState([]);
    const [trendData, setTrendData] = useState({
        xData: [],
        yData: [],
    });

    const [summary, setSummary] = useState({
        total: 0,
        count: 0,
        average: 0,
        highest: 0,
    });

    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const [sortOrder, setSortOrder] = useState("desc");

    // Change this endpoint if your backend uses a different route.
    const EXPENSE_SEARCH_API =
        "https://expense-todo-five.vercel.app/api/expenses/search";

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();

            setCategories(data?.categories || []);
        } catch (err) {
            console.error(err);

            if (
                err?.message?.includes("Authentication") ||
                err?.message?.includes("token")
            ) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            setError("Failed to load categories.");
        }
    };

    const handleDateChange = (field, value) => {
        setDates((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearch = async () => {
        if (!category) {
            setError("Please select a category.");
            return;
        }

        if (!dates.startDate || !dates.endDate) {
            setError("Please select both dates.");
            return;
        }

        if (dates.startDate > dates.endDate) {
            setError("Start date cannot be after end date.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const filters = {
                category,
                startDate: dates.startDate,
                endDate: dates.endDate,
            };

            const [expenseResponse, trendResponse] = await Promise.all([
                searchExpenses(filters),
                getSpendingTrends({
                    ...filters,
                    interval: "daily",
                }),
            ]);

            const expenseList = expenseResponse?.expenses || expenseResponse || [];

            const sortedExpenses = [...expenseList].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
            });

            setExpenses(sortedExpenses);

            setSummary({
                total: expenseResponse?.summary?.totalAmount || 0,
                count: expenseResponse?.summary?.expenseCount || 0,
                average: expenseResponse?.summary?.averageExpense || 0,
                highest: expenseResponse?.summary?.highestExpense || 0,
            });

            const trends = trendResponse?.spendingTrends || [];

            const groupedTrends = {};

            trends.forEach((entry) => {
                const date = new Date(entry.date);
                const key = date.toISOString().split("T")[0];

                groupedTrends[key] =
                    (groupedTrends[key] || 0) + (Number(entry.amount) || 0);
            });

            const sortedTrendEntries = Object.entries(groupedTrends).sort(
                ([dateA], [dateB]) => dateA.localeCompare(dateB)
            );

            setTrendData({
                xData: sortedTrendEntries.map(([date]) =>
                    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    })
                ),
                yData: sortedTrendEntries.map(([, amount]) => amount),
            });

            setSearched(true);
        } catch (err) {
            console.error(err);

            if (
                err?.message?.includes("Authentication") ||
                err?.message?.includes("token")
            ) {
                localStorage.clear();
                navigate("/login");
                return;
            }

            setError("Failed to fetch category analysis.");
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async (filters) => {
        const params = new URLSearchParams({
            category: filters.category,
            startDate: filters.startDate,
            endDate: filters.endDate,
        });

        const response = await fetch(
            `${EXPENSE_SEARCH_API}?${params.toString()}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.status === 401 || response.status === 403) {
            throw new Error("Authentication failed");
        }

        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }

        return response.json();
    };

    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [expenses, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* FILTERS */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <FaSearch className="text-indigo-500" />
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                            Search by Category
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* CATEGORY */}
                        <div className="flex items-center gap-2 border border-[var(--border-color)] rounded-md px-3 py-2">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)]"
                            >
                                <option value="">Select Category</option>

                                {categories.map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                        className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* START DATE */}
                        <div className="flex items-center gap-2 border border-[var(--border-color)] rounded-md px-3 py-2">
                            <FaCalendarAlt className="text-xs text-gray-400" />

                            <input
                                type="date"
                                value={dates.startDate}
                                onChange={(e) =>
                                    handleDateChange("startDate", e.target.value)
                                }
                                className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)]"
                            />
                        </div>

                        {/* END DATE */}
                        <div className="flex items-center gap-2 border border-[var(--border-color)] rounded-md px-3 py-2">
                            <FaCalendarAlt className="text-xs text-gray-400" />

                            <input
                                type="date"
                                value={dates.endDate}
                                onChange={(e) =>
                                    handleDateChange("endDate", e.target.value)
                                }
                                className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)]"
                            />
                        </div>

                        {/* SEARCH */}
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-50 transition"
                        >
                            <FaSearch className="text-xs" />
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                </div>
            </div>

            {/* RESULTS */}
            {searched && !loading && (
                <>
                    {/* SUMMARY */}
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                        <div className="metric-card">
                            <div className="metric-value">
                                ₹{summary.total.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="metric-label">Total Spending</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">{summary.count}</div>
                            <div className="metric-label">Expenses</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">
                                ₹{summary.average.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="metric-label">Average Expense</div>
                        </div>

                        <div className="metric-card">
                            <div className="metric-value">
                                ₹{summary.highest.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="metric-label">Highest Expense</div>
                        </div>
                    </div>

                    {/* GRAPH */}
                    <div className="chart-card">
                        <h4 className="chart-title">
                            {category} Spending Trend
                        </h4>

                        {trendData.xData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <LineChart
                                    xAxis={[
                                        {
                                            data: trendData.xData,
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
                                            valueFormatter: (value) =>
                                                `₹${Number(value).toLocaleString("en-IN")}`,
                                        },
                                    ]}
                                    series={[
                                        {
                                            data: trendData.yData,
                                            label: category,
                                            color: "#818cf8",
                                        },
                                    ]}
                                    height={300}
                                    grid={{
                                        vertical: true,
                                        horizontal: true,
                                    }}
                                    sx={{
                                        "& .MuiChartsAxis-tickLabel": {
                                            fill: "var(--text-primary) !important",
                                        },
                                        "& .MuiChartsAxis-line": {
                                            stroke: "var(--border-color)",
                                        },
                                        "& .MuiChartsAxis-tick": {
                                            stroke: "var(--border-color)",
                                        },
                                        "& .MuiChartsGrid-line": {
                                            stroke: "var(--border-color)",
                                        },
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--text-secondary)] text-center py-8">
                                No trend data available.
                            </p>
                        )}
                    </div>

                    {/* EXPENSE LIST */}
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg">
                        <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)]">
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                    {category} Expenses
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {dates.startDate} to {dates.endDate}
                                </p>
                            </div>

                            <button
                                onClick={toggleSort}
                                title={
                                    sortOrder === "desc"
                                        ? "Newest first"
                                        : "Oldest first"
                                }
                                className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                            >
                                {sortOrder === "desc" ? (
                                    <HiChevronDoubleDown className="text-lg" />
                                ) : (
                                    <HiChevronDoubleUp className="text-lg" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-2 p-3 max-h-[55vh] overflow-y-auto">
                            {sortedExpenses.length > 0 ? (
                                sortedExpenses.map((expense) => (
                                    <div
                                        key={expense._id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] hover:shadow-sm transition"
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

                                        <span className="text-sm font-semibold text-indigo-500">
                                            ₹{Number(expense.amount || 0).toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-[var(--text-secondary)] py-8">
                                    No expenses found for this category and date range.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

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

export default CategoryAnalysis;
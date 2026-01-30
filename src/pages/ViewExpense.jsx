import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import {
  downloadExpensesPDF,
  downloadExpensesExcel,
} from "../utils/exportExpenses";

/* ================= CONSTANTS ================= */

const ITEMS_PER_PAGE = 10;

/* ================= STYLED COMPONENTS ================= */

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f3ec78, #af4261);
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
`;

const DropdownContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 200px;
`;

const ExpenseList = styled.div`
  max-height: 55vh;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const ExpenseDetails = styled.div`
  flex: 1;
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;

  &:hover {
    color: #af4261;
    transform: scale(1.15);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  margin: 20px 0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ active }) => (active ? "#af4261" : "#eee")};
  color: ${({ active }) => (active ? "#fff" : "#333")};

  &:hover {
    background: #af4261;
    color: white;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ type }) =>
    type === "pdf" ? "#d32f2f" : "#2e7d32"};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;


/* ================= COMPONENT ================= */

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

      const token = JSON.parse(localStorage.getItem("token"));

      const response = await fetch(
        `http://localhost:3000/api/expenses/filter/month?month=${month}&year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
        }
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError("Failed to fetch expenses. Please try again.");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      const isAuthValid = await checkAuth(response);
      if (!isAuthValid) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        toast.success("Expense Deleted!");
        setExpenses((prev) => prev.filter((e) => e._id !== id));
      } else {
        toast.warning("Failed to delete expense");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  /* ================= PAGINATION LOGIC ================= */

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

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = filteredExpenses
    .slice()
    .reverse()
    .slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  /* ================= JSX ================= */

  return (
    <PageContainer>
      <ContentWrapper>
        <DropdownContainer>
          <div>
            <label>Month: </label>
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label>Year: </label>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </Select>
          </div>

          <div>
            <label>Search: </label>
            <SearchInput
              type="text"
              placeholder="Search by name or issued to..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label>Category: </label>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <ExportButtons>
            <ExportButton
              type="pdf"
              onClick={() =>
                downloadExpensesPDF(filteredExpenses, month, year)
              }
            >
              <FaFilePdf /> PDF
            </ExportButton>

            <ExportButton
              type="excel"
              onClick={() =>
                downloadExpensesExcel(filteredExpenses, month, year)
              }
            >
              <FaFileExcel /> Excel
            </ExportButton>
          </ExportButtons>
        </DropdownContainer>


        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ExpenseList>
          {paginatedExpenses.length > 0 ? (
            paginatedExpenses.map((expense) => (
              <ExpenseItem key={expense._id}>
                <ExpenseDetails>
                  <div>
                    <strong>{expense.expenseName}</strong> —{" "}
                    {expense.expenseType}
                  </div>
                  <small>
                    Date:{" "}
                    {new Date(expense.date).toLocaleDateString()} | Issued To:{" "}
                    {expense.issuedTo}
                  </small>
                  <div>
                    <strong>₹{expense.amount.toFixed(2)}</strong>
                  </div>
                </ExpenseDetails>

                <ActionIcons>
                  <IconButton onClick={() => handleEdit(expense._id)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => deleteExpense(expense._id)}>
                    <FaTrash />
                  </IconButton>
                </ActionIcons>
              </ExpenseItem>
            ))
          ) : (
            <div>
              {expenses.length === 0
                ? "No expenses found for this period."
                : "No expenses match the current filters."}
            </div>
          )}
        </ExpenseList>

        {totalPages > 1 && (
          <PaginationWrapper>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => (
              <PageButton
                key={i}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}

            <PageButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </PageButton>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default ViewExpense;

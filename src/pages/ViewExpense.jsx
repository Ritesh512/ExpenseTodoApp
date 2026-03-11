import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaEdit, FaTrash, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkAuth from "../api/checkauth";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import {
  downloadExpensesPDF,
  downloadExpensesExcel,
} from "../utils/exportExpenses";

/* ================= ANIMATIONS ================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

/* ================= CONSTANTS ================= */
const ITEMS_PER_PAGE = 10;

/* ================= STYLED COMPONENTS ================= */
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-bg-main);
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  margin-bottom: 24px;
`;

const FilterSection = styled(GlassCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--glass-border);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--color-brand-500);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  & label {
    color: var(--color-grey-400);
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Select = styled.select`
  background: transparent;
  border: none;
  color: var(--color-grey-800);
  font-size: 1.5rem;
  padding: 4px;
  cursor: pointer;
  outline: none;

  & option {
    background: var(--color-grey-0);
    color: var(--color-grey-800);
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: var(--color-grey-800);
  font-size: 1.5rem;
  width: 180px;
  outline: none;

  &::placeholder {
    color: var(--color-grey-400);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ExpenseList = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--glass-border);
    border-radius: 10px;
  }
`;

const ExpenseItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 2rem;
  padding: 1.6rem 2.4rem;
  background: var(--color-bg-card);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  margin-bottom: 1.2rem;
  animation: ${fadeIn} 0.4s ease-out forwards;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateX(8px);
    border-color: var(--color-brand-500);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 1rem;
    padding: 1.2rem 1.6rem;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }

  span {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
`;

const Amount = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-500);
  text-align: right;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    grid-row: 1;
    grid-column: 2;
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.8rem;

  @media (max-width: 768px) {
    grid-row: 2;
    grid-column: 2;
    gap: 0.4rem;
  }
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--color-grey-400);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-brand-500);
    background: var(--color-bg-accent);
    transform: translateY(-2px);
  }

  &.delete:hover {
    color: var(--color-red-700);
    background: rgba(248, 113, 113, 0.1);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding-bottom: 20px;
`;

const PageButton = styled.button`
  min-width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  background: ${({ active }) => (active ? "var(--color-brand-600)" : "var(--glass-bg)")};
  color: ${({ active }) => (active ? "#fff" : "var(--color-grey-400)")};
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: var(--color-brand-500);
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  background: ${({ type }) =>
    type === "pdf" ? "rgba(239, 68, 68, 0.1)" : "rgba(52, 211, 153, 0.1)"};
  color: ${({ type }) =>
    type === "pdf" ? "var(--color-red-700)" : "var(--color-green-700)"};
  border: 1px solid ${({ type }) =>
    type === "pdf" ? "rgba(239, 68, 68, 0.2)" : "rgba(52, 211, 153, 0.2)"};

  &:hover {
    transform: translateY(-2px);
    background: ${({ type }) =>
      type === "pdf" ? "var(--color-red-700)" : "var(--color-green-700)"};
    color: white;
  }
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  padding: 0 10px;
`;

const TotalCard = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
  padding: 16px 28px;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
  font-weight: 800;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
  }

  & span {
    font-size: 1.4rem;
    font-weight: 500;
    opacity: 0.9;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  color: var(--color-grey-900);
  font-weight: 700;
  margin-bottom: 8px;
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
    0
  );

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = filteredExpenses
    .slice()
    .reverse()
    .slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    <PageContainer>
      <ContentWrapper>
        <TotalAmount>
          <div>
            <SectionTitle>Expenses</SectionTitle>
            <p style={{ color: 'var(--color-grey-400)', fontSize: '1.4rem' }}>
              Track and manage your monthly spending
            </p>
          </div>
          <TotalCard>
            <span>{selectedCategory ? `${selectedCategory}` : "Total Spent"}</span>
            ₹{totalAmount.toFixed(2)}
          </TotalCard>
        </TotalAmount>

        <FilterSection>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <InputGroup>
              <label><FaCalendarAlt /></label>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                {Array.from({ length: 10 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option key={y} value={y}>{y}</option>
                  );
                })}
              </Select>
            </InputGroup>

            <InputGroup>
              <label><FaFilter /></label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </InputGroup>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <InputGroup>
              <label><FaSearch /></label>
              <SearchInput
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <ExportButtons>
              <ExportButton
                type="pdf"
                onClick={() => downloadExpensesPDF(filteredExpenses, month, year)}
              >
                <FaFilePdf />
              </ExportButton>
              <ExportButton
                type="excel"
                onClick={() => downloadExpensesExcel(filteredExpenses, month, year)}
              >
                <FaFileExcel />
              </ExportButton>
            </ExportButtons>
          </div>
        </FilterSection>

        {error && (
          <GlassCard style={{ color: 'var(--color-red-700)', textAlign: 'center' }}>
            {error}
          </GlassCard>
        )}

        <ExpenseList>
          {paginatedExpenses.length > 0 ? (
            paginatedExpenses.map((expense, index) => (
              <ExpenseItem key={expense._id} index={index}>
                <ItemInfo>
                  <h3>{expense.expenseName}</h3>
                  <span>
                    {new Date(expense.date).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })} 
                    <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span> 
                    {expense.expenseType} • {expense.issuedTo}
                  </span>
                </ItemInfo>

                <Amount>₹{expense.amount.toFixed(2)}</Amount>

                <ActionIcons>
                  <IconButton onClick={() => handleEdit(expense._id)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton className="delete" onClick={() => deleteExpense(expense._id)}>
                    <FaTrash />
                  </IconButton>
                </ActionIcons>
              </ExpenseItem>
            ))
          ) : (
            <GlassCard style={{ textAlign: 'center', color: 'var(--color-grey-400)' }}>
              {expenses.length === 0
                ? "No expenses found for this period."
                : "No expenses match the current filters."}
            </GlassCard>
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

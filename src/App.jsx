import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Private from "./ui/Private";
import Setting from "./pages/Settings";
import Todo from "./pages/Todo";
import Expenses from "./pages/Expenses";
import Birthday from "./pages/Birthday";
import EditListName from "./pages/EditListName";
import React, { useState, useEffect } from "react";

import AddExpense from "./pages/AddExpense";
import ViewExpense from "./pages/ViewExpense";
import Compare from "./pages/Compare";
import AnalysisPage from "./pages/AnalysisPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import EditExpense from "./pages/EditExpense";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Private />}>
            <Route
              element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="todo/:listId" element={<Todo />} />
              <Route path="todo/edit-list-name" element={<EditListName />} />

              <Route path="expenses" element={<Expenses />}>
                <Route index element={<Navigate to="view-expense" replace />} />
                <Route path="add-expense" element={<AddExpense />} />
                <Route path="view-expense" element={<ViewExpense />} />
                <Route path="edit/:id" element={<EditExpense />} />
                <Route path="compare" element={<Compare />} />
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="ai-insights" element={<AIInsightsPage />} />
              </Route>
              <Route path="settings" element={<Setting />} />
              <Route path="birthday" element={<Birthday />} />
            </Route>
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Private from "./ui/Private";
import Settings from "./pages/Settings";
import Todo from "./pages/Todo";
import Expenses from "./pages/Expenses";
import Birthday from "./pages/Birthday";
import EditListName from "./pages/EditListName";


import AddExpense from './pages/AddExpense';
import ViewExpense from './pages/ViewExpense';
import Compare from './pages/Compare';
import AnalysisPage from './pages/AnalysisPage';
import EditExpense from './pages/EditExpense';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './App.css'

function App() {

  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<Private />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="todo/:listId" element={<Todo />} />
              <Route path="todo/edit-list-name" element={<EditListName />} />
              
              <Route path="expenses" element={<Expenses />} >
                <Route index element={<Navigate to="view-expense" replace />} />
                <Route path="add-expense" element={<AddExpense />} />
                <Route path="view-expense" element={<ViewExpense />} />
                <Route path="/expenses/edit/:id" element={<EditExpense />} />
                <Route path="compare" element={<Compare />} />
                <Route path="analysis" element={<AnalysisPage />} />
              </Route>

              <Route path="birthday" element={<Birthday />} />
              {/* <Route path="settings" element={<Settings />} /> */}
            </Route>
          </Route>


          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  )
}

export default App

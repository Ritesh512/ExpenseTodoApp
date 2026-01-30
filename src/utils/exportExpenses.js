import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ================= FORMAT DATA ================= */

const formatExpenses = (expenses) =>
  expenses.map((exp) => ({
    expenseName: exp.expenseName,
    expenseType: exp.expenseType,
    date: new Date(exp.date).toLocaleDateString(),
    issuedTo: exp.issuedTo,
    amount: exp.amount,
  }));

/* ================= PDF EXPORT ================= */

export const downloadExpensesPDF = (expenses, month, year) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Expense Report - ${month}/${year}`, 14, 15);

  const tableData = formatExpenses(expenses);

  autoTable(doc, {
  startY: 25,
  head: [["Expense Name", "Type", "Date", "Issued To", "Amount"]],
  body: tableData.map((e) => [
    e.expenseName,
    e.expenseType,
    e.date,
    e.issuedTo,
    `Rs. ${e.amount}`,
  ]),
});


  doc.save(`Expense_Report_${month}_${year}.pdf`);
};

/* ================= EXCEL EXPORT ================= */

export const downloadExpensesExcel = (expenses, month, year) => {
  const worksheetData = formatExpenses(expenses);

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Expense_Report_${month}_${year}.xlsx`);
};

# Daily To-Do and Expense Tracker App

## Description

This app is designed to help users organize their Daily Tasks and expenses efficiently. With separate functionalities for managing to-dos, tracking expenses, and a dashboard to visualize data, it serves as an all-in-one solution for personal productivity and financial management.

---

## Live Demo

Access the app here: [Expense and To-Do Tracker](http://localhost:3000/)

---

## Features

### 1. **To-Do List Management**

- Create multiple lists for different categories (e.g., _Food_, _Work_, _Personal_).
- Choose daily, weekly, monthly, yearly, or regular (one-time) lists.
- Add and delete tasks; mark them complete, with pending tasks shown first.
- Recurring task completion resets with the list period.
- Optional list reminders run at a chosen local time while the app is open:
  daily lists remind daily, weekly lists on Sundays, monthly lists every
  Sunday, and yearly lists on the first of each month.
- Example:
  - List: _Groceries_
  - Task: _Buy 1kg apples_

### 2. **Expense Tracker**

- Add, update, and delete expenses.
- Multiple analysis features:
  - **Compare Monthly Data**: Compare expenses across two selected months.
  - **Visualizations**:
    - Donut Chart: Shows distribution of expenses over a data range.
    - Bar Chart: Highlights top 5 and lowest 5 expenses.
    - Line Chart: Tracks expense trends over time.

### 3. **Dashboard**

- Comprehensive summary of to-dos and expenses:
  - Number of pending/completed tasks.
  - Total and categorized expenses.
  - Key insights from expense analysis.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Charts**: Chart.js, Apex Charts for visualizations

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm / yarn

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Ritesh512/ExpenseTodoApp
   cd ExpenseTodoApp


   ```

## Setup Instructions

### Install Dependencies

Run the following command to install all necessary dependencies:

```bash
npm install
Start the Development Server
To start the app locally, use the command:

npm run dev
```

### Open the App

Once the server is running, open your browser and navigate to:

```bash
http://localhost:3000
```

---

### Future Enhancements

- Export Data: Allow exporting expenses as CSV or Excel files.
- Mobile App: Develop a mobile version for easier access.

### Backend Code

[Code](https://github.com/Ritesh512/ExpenseTodoBackend)

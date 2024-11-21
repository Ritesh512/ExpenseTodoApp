export const getCategoryBreakdown = async (filters) => {
    const { startDate, endDate } = filters;
  
    const response = await fetch(
      `http://localhost:3000/api/expenses/analysis/category-breakdown?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Error fetching category breakdown: ${response.statusText}`);
    }
  
    return response.json();
  };
  
  export const getSpendingTrends = async (filters) => {
    const { startDate, endDate, interval = "monthly" } = filters;
  
    const response = await fetch(
      `http://localhost:3000/api/expenses/analysis/spending-trends?startDate=${startDate}&endDate=${endDate}&interval=${interval}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Error fetching spending trends: ${response.statusText}`);
    }
  
    return response.json();
  };
  
  export const getTopExpenses = async (filters) => {
    const { startDate, endDate, limit = 5 } = filters;
  
    const response = await fetch(
      `http://localhost:3000/api/expenses/analysis/top-expenses?startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Error fetching top expenses: ${response.statusText}`);
    }
  
    return response.json();
  };
  

  export const getLowExpenses = async (filters) => {
    const { startDate, endDate, limit = 5 } = filters;
  
    const response = await fetch(
      `http://localhost:3000/api/expenses/analysis/low-expenses?startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Error fetching top expenses: ${response.statusText}`);
    }
  
    return response.json();
  };
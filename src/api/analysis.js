import checkAuth from "./checkauth";

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

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

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

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

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

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

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

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

  if (!response.ok) {
    throw new Error(`Error fetching low expenses: ${response.statusText}`);
  }

  return response.json();
};

// AI Analysis API
export const getAIAnalysis = async (startDate, endDate) => {
  const response = await fetch(
    `http://localhost:3000/api/ai/analysis?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }
  );

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

  if (response.status === 429) {
    throw new Error("Too many requests. Please wait a moment before trying again. (Rate limited)");
  }

  if (!response.ok) {
    throw new Error(`Error fetching AI analysis: ${response.statusText}`);
  }

  return response.json();
};

// AI Recommendations API
export const getAIRecommendations = async (month, year) => {
  const response = await fetch(
    `http://localhost:3000/api/ai/recommendations?month=${month}&year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }
  );

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

  if (response.status === 429) {
    throw new Error("Too many requests. Please wait a moment before trying again. (Rate limited)");
  }

  if (!response.ok) {
    throw new Error(`Error fetching AI recommendations: ${response.statusText}`);
  }

  return response.json();
};

// AI Forecast API
export const getAIForecast = async (months) => {
  const response = await fetch(
    `http://localhost:3000/api/ai/forecast?months=${months}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    }
  );

  const isAuthValid = await checkAuth(response);
  if (!isAuthValid) {
    throw new Error("Authentication failed. Redirecting to login...");
  }

  if (response.status === 429) {
    throw new Error("Too many requests. Please wait a moment before trying again. (Rate limited)");
  }

  if (!response.ok) {
    throw new Error(`Error fetching AI forecast: ${response.statusText}`);
  }

  return response.json();
};
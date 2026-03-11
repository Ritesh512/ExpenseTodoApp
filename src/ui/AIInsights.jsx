import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { getAIAnalysis, getAIRecommendations, getAIForecast } from "../api/analysis";
import { FaSpinner } from "react-icons/fa";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

/* ---------------- Layout ---------------- */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease-out;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 4px;
  background: var(--color-bg-accent);
  border-radius: var(--border-radius-md);
  overflow-x: auto;
  border: 1px solid var(--glass-border);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  background: ${p => p.active ? "var(--color-brand-600)" : "transparent"};
  color: ${p => p.active ? "white" : "var(--color-grey-500)"};
  font-weight: 600;
  font-size: 1.4rem;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    color: ${p => p.active ? "white" : "var(--color-grey-900)"};
    background: ${p => p.active ? "var(--color-brand-600)" : "var(--color-bg-card)"};
  }
`;

const ContentBox = styled.div`
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  min-height: 400px;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  margin-top: 30px;
  color: var(--color-grey-900);
  display: flex;
  align-items: center;
  gap: 10px;

  &:first-child {
    margin-top: 0;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--glass-border);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-800) 100%);
  color: white;
  padding: 24px;
  border-radius: var(--border-radius-md);
  text-align: center;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const SummaryLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const SummaryValue = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CategoryItem = styled.div`
  background: var(--color-bg-accent);
  padding: 20px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--glass-border);
`;

const CategoryName = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-grey-900);
  margin-bottom: 10px;
`;

const CategoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const AmountString = styled.span`
  font-weight: 700;
  color: var(--color-brand-500);
  font-size: 1.6rem;
`;

const PercentageString = styled.span`
  color: var(--color-grey-500);
  font-size: 1.4rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: var(--color-grey-200);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand-500), var(--color-brand-700));
  width: ${p => p.percent}%;
  transition: width 1s ease-out;
`;

const ExpenseCard = styled.div`
  background: var(--color-bg-card);
  padding: 16px 20px;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-red-700);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  
  span:first-child {
    font-weight: 600;
    color: var(--color-grey-900);
  }
  
  span:last-child {
    color: var(--color-brand-600);
    font-weight: 700;
  }
`;

const AIBox = styled.div`
  background: var(--color-bg-accent);
  border: 1px solid var(--color-brand-100);
  padding: 24px;
  border-radius: var(--border-radius-lg);
  font-size: 1.5rem;
  line-height: 1.8;
  color: var(--color-grey-800);

  h1, h2, h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: var(--color-grey-900);
  }

  strong {
    color: var(--color-brand-600);
  }

  ul, ol {
    padding-left: 20px;
    margin: 15px 0;
  }

  li {
    margin-bottom: 10px;
  }
`;

const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-brand-500);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size: 4rem;
  color: var(--color-brand-500);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--color-grey-500);
  font-size: 1.6rem;
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: ${p => p.isRateLimit ? "rgba(251, 191, 36, 0.1)" : "rgba(248, 113, 113, 0.1)"};
  border: 1px solid ${p => p.isRateLimit ? "var(--color-yellow-700)" : "var(--color-red-700)"};
  color: ${p => p.isRateLimit ? "var(--color-yellow-700)" : "var(--color-red-700)"};
  padding: 20px;
  border-radius: var(--border-radius-md);
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ErrorIcon = styled.span`
  font-size:20px;
  flex-shrink:0;
`;

const ErrorContent = styled.div`
  flex:1;
  line-height:1.5;
`;

const ErrorTitle = styled.div`
  font-weight:bold;
  margin-bottom:4px;
`;

/* ---------------- Component ---------------- */

const AIInsights = ({ dateRange, month, year }) => {

    const [activeTab, setActiveTab] = useState("analysis");
    const [analysis, setAnalysis] = useState(null);
    const [recommend, setRecommend] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRateLimit, setIsRateLimit] = useState(false);

    useEffect(() => {
        fetchData("analysis");
    }, []);

    const fetchData = async (tab) => {

        setLoading(true);
        setError(null);
        setIsRateLimit(false);

        try {

            if (tab === "analysis") {
                const data = await getAIAnalysis(dateRange.startDate, dateRange.endDate);
                setAnalysis(data);
            }

            if (tab === "recommendations") {
                const data = await getAIRecommendations(month, year);
                setRecommend(data);
            }

            if (tab === "forecast") {
                const data = await getAIForecast(2);
                setForecast(data);
            }

        } catch (err) {
            const isRateLimited = err.message.includes("rate limit") || err.message.includes("Too many requests");
            setIsRateLimit(isRateLimited);
            setError(err.message);
            toast.error(err.message);
        }

        setLoading(false);
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        fetchData(tab);
    };

    return (
        <Container>

            <TabsContainer>

                <TabButton active={activeTab === "analysis"} onClick={() => changeTab("analysis")}>
                    📊 Analysis
                </TabButton>

                <TabButton active={activeTab === "recommendations"} onClick={() => changeTab("recommendations")}>
                    💡 Recommendations
                </TabButton>

                <TabButton active={activeTab === "forecast"} onClick={() => changeTab("forecast")}>
                    🔮 Forecast
                </TabButton>

            </TabsContainer>

            <ContentBox>

                {loading && <Loading>
                    <SpinnerIcon />
                    <LoadingText>Loading AI insights...</LoadingText>
                </Loading>}

                {error && (
                    <ErrorMessage isRateLimit={isRateLimit}>
                        <ErrorIcon>{isRateLimit ? "⏱️" : "⚠️"}</ErrorIcon>
                        <ErrorContent>
                            <ErrorTitle>{isRateLimit ? "Rate Limited" : "Error"}</ErrorTitle>
                            <div>{error}</div>
                        </ErrorContent>
                    </ErrorMessage>
                )}

                {/* ---------- ANALYSIS ---------- */}

                {!loading && activeTab === "analysis" && analysis && (

                    <>
                        <Title>Period Analysis</Title>

                        <SummaryGrid>

                            <SummaryCard>
                                <SummaryLabel>Total Spending</SummaryLabel>
                                <SummaryValue>₹{analysis.summary.totalSpending.toLocaleString()}</SummaryValue>
                            </SummaryCard>

                            <SummaryCard>
                                <SummaryLabel>Transactions</SummaryLabel>
                                <SummaryValue>{analysis.summary.transactions}</SummaryValue>
                            </SummaryCard>

                            <SummaryCard>
                                <SummaryLabel>Avg Transaction</SummaryLabel>
                                <SummaryValue>₹{analysis.summary.avgTransaction.toLocaleString()}</SummaryValue>
                            </SummaryCard>

                        </SummaryGrid>

                        <Title>Category Breakdown</Title>

                        <CategoryList>

                            {analysis.categoryBreakdown.slice(0, 10).map((c, i) => (

                                <CategoryItem key={i}>

                                    <CategoryName>{c.category}</CategoryName>

                                    <ProgressBar>
                                        <Progress percent={c.percentage} />
                                    </ProgressBar>

                                    <CategoryStats>
                                        <AmountString>₹{c.amount.toLocaleString()}</AmountString>
                                        <PercentageString>{c.percentage}%</PercentageString>
                                    </CategoryStats>

                                </CategoryItem>

                            ))}

                        </CategoryList>

                        <Title>Top Expenses</Title>

                        <CategoryList>

                            {analysis.topExpenses?.map((e, i) => (
                                <ExpenseCard key={i}>
                                    <span>{e.name}</span>
                                    <span>₹{e.amount.toLocaleString()} ({e.category})</span>
                                </ExpenseCard>
                            ))}

                        </CategoryList>

                        <Title>AI Analysis</Title>

                        <AIBox>

                            <AIBadge>AI Generated Insight</AIBadge>

                            <ReactMarkdown>
                                {analysis.aiAnalysis}
                            </ReactMarkdown>

                        </AIBox>

                    </>
                )}

                {/* ---------- RECOMMENDATIONS ---------- */}

                {!loading && activeTab === "recommendations" && recommend && (

                    <>
                        <Title>Monthly Recommendations</Title>

                        <SummaryGrid>

                            <SummaryCard>
                                <SummaryLabel>Month</SummaryLabel>
                                <SummaryValue>{recommend.month}</SummaryValue>
                            </SummaryCard>

                            <SummaryCard>
                                <SummaryLabel>Total Spending</SummaryLabel>
                                <SummaryValue>₹{recommend.monthlySpending.toLocaleString()}</SummaryValue>
                            </SummaryCard>

                        </SummaryGrid>

                        <Title>AI Recommendations</Title>

                        <AIBox>

                            <AIBadge>AI Generated Insight</AIBadge>

                            <ReactMarkdown>
                                {recommend.aiRecommendations}
                            </ReactMarkdown>

                        </AIBox>

                    </>
                )}

                {/* ---------- FORECAST ---------- */}

                {!loading && activeTab === "forecast" && forecast && (

                    <>
                        <Title>Spending Trend</Title>

                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={forecast.historicalData}>
                                <XAxis dataKey="month" stroke="var(--color-grey-500)" fontSize={12} />
                                <YAxis stroke="var(--color-grey-500)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--color-grey-0)', 
                                        borderColor: 'var(--glass-border)',
                                        color: 'var(--color-grey-900)'
                                    }} 
                                />
                                <Line type="monotone" dataKey="total" stroke="var(--color-brand-500)" strokeWidth={3} dot={{ fill: 'var(--color-brand-500)' }} />
                            </LineChart>
                        </ResponsiveContainer>

                        <Title>AI Forecast</Title>

                        <AIBox>

                            <AIBadge>AI Generated Insight</AIBadge>

                            <ReactMarkdown>
                                {forecast.aiForecast}
                            </ReactMarkdown>

                        </AIBox>

                    </>
                )}

            </ContentBox>

        </Container>
    );
};

export default AIInsights;
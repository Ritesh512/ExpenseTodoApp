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
  display:flex;
  flex-direction:column;
  gap:20px;
  padding:20px;
  background:#f8f9fa;
  border-radius:10px;

  @media(max-width:768px){
    padding:15px;
  }

  @media(max-width:480px){
    padding:10px;
  }
`;

const TabsContainer = styled.div`
  display:flex;
  gap:10px;
  overflow-x:auto;

  &::-webkit-scrollbar{
    display:none;
  }
`;

const TabButton = styled.button`
  padding:10px 18px;
  border:none;
  border-radius:6px;
  background:${p => p.active ? "#667eea" : "#e0e0e0"};
  color:${p => p.active ? "white" : "#333"};
  cursor:pointer;
  font-weight:500;
  white-space:nowrap;

  @media(max-width:480px){
    padding:8px 14px;
    font-size:13px;
  }
`;

const ContentBox = styled.div`
  background:white;
  border-radius:8px;
  padding:20px;
  max-height:650px;
  overflow-y:auto;

  @media(max-width:768px){
    padding:15px;
  }

  @media(max-width:480px){
    padding:12px;
  }
`;

const Title = styled.h3`
  margin-bottom:15px;
  border-bottom:2px solid #667eea;
  padding-bottom:8px;
  color:#333;

  @media(max-width:480px){
    font-size:16px;
  }
`;

/* ---------------- Cards ---------------- */

const SummaryGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  gap:15px;

  @media(max-width:480px){
    grid-template-columns:repeat(2,1fr);
  }
`;

const SummaryCard = styled.div`
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:white;
  padding:15px;
  border-radius:8px;
  text-align:center;
`;

const SummaryLabel = styled.div`
  font-size:12px;
`;

const SummaryValue = styled.div`
  font-size:18px;
  font-weight:bold;
`;

/* ---------------- Categories ---------------- */

const CategoryList = styled.div`
  display:flex;
  flex-direction:column;
  gap:12px;
`;

const CategoryItem = styled.div`
  background:#f5f5f5;
  padding:12px;
  border-radius:6px;
`;

const CategoryName = styled.div`
  font-weight:600;
`;

const CategoryStats = styled.div`
  display:flex;
  justify-content:space-between;
  margin-top:6px;
`;

const Amount = styled.span`
  font-weight:bold;
  color:#667eea;
`;

const Percentage = styled.span`
  color:#999;
`;

/* ---------------- Progress Bar ---------------- */

const ProgressBar = styled.div`
  height:6px;
  background:#e0e0e0;
  border-radius:5px;
  margin-top:6px;
`;

const Progress = styled.div`
  height:100%;
  background:#667eea;
  border-radius:5px;
  width:${p => p.percent}%;
`;

/* ---------------- Top Expenses ---------------- */

const ExpenseItem = styled.div`
  background:#fff5f5;
  padding:12px;
  border-radius:6px;
  border-left:4px solid #ff6b6b;
  display:flex;
  justify-content:space-between;
`;

/* ---------------- AI Box ---------------- */

const AIBox = styled.div`
  background:linear-gradient(135deg,#eef2ff,#f7f8ff);
  border-left:4px solid #667eea;
  padding:18px;
  border-radius:8px;
  font-size:14px;
  line-height:1.7;

  h1,h2,h3{
    margin-top:10px;
    color:#333;
  }

  strong{
    color:#667eea;
  }

  ul{
    padding-left:18px;
  }

  li{
    margin-bottom:6px;
  }

  @media(max-width:480px){
    font-size:13px;
    padding:14px;
  }
`;

const AIBadge = styled.div`
  display:inline-block;
  background:#667eea;
  color:white;
  padding:4px 10px;
  border-radius:20px;
  font-size:12px;
  margin-bottom:10px;
`;

/* ---------------- Loading ---------------- */

const Loading = styled.div`
  text-align:center;
  padding:40px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:15px;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size:36px;
  color:#667eea;
  animation:spin 1s linear infinite;

  @keyframes spin{
    from{ transform:rotate(0deg); }
    to{ transform:rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color:#666;
  font-size:16px;
  margin:0;

  @media(max-width:480px){
    font-size:14px;
  }
`;

/* ---------------- Error Messages ---------------- */

const ErrorMessage = styled.div`
  background:${p => p.isRateLimit ? "#fff3cd" : "#f8d7da"};
  border:1px solid ${p => p.isRateLimit ? "#ffc107" : "#f5c6cb"};
  color:${p => p.isRateLimit ? "#856404" : "#721c24"};
  padding:16px;
  border-radius:8px;
  margin:10px 0;
  font-size:15px;
  display:flex;
  align-items:center;
  gap:12px;

  @media(max-width:480px){
    font-size:13px;
    padding:12px;
  }
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
                                        <Amount>₹{c.amount.toLocaleString()}</Amount>
                                        <Percentage>{c.percentage}%</Percentage>
                                    </CategoryStats>

                                </CategoryItem>

                            ))}

                        </CategoryList>

                        <Title>Top Expenses</Title>

                        <CategoryList>

                            {analysis.topExpenses?.map((e, i) => (
                                <ExpenseItem key={i}>
                                    <span>{e.name}</span>
                                    <span>₹{e.amount.toLocaleString()} ({e.category})</span>
                                </ExpenseItem>
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
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#667eea" strokeWidth={3} />
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
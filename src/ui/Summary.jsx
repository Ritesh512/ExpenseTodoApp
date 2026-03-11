import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const SummaryContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  margin-bottom: 60px; /* Increased bottom margin for footer clearance */

  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px 0;
    margin-bottom: 100px; /* Extra clearance for mobile/tablet footer */
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 120px; /* Even more clearance for small screens */
  }
`;

const SummaryHeader = styled.h2`
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#3498db'};

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CardTitle = styled.h4`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.color || '#2c3e50'};
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  color: #95a5a6;
`;

const TrendIndicator = styled.span`
  display: inline-block;
  margin-left: 8px;
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.isPositive ? '#27ae60' : '#e74c3c'};
`;

const CategoryComparison = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on tablet */
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Single column on mobile */
    gap: 8px;
  }
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid ${props => props.isPositive ? '#27ae60' : '#e74c3c'};
  margin-bottom: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f3f4;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    margin-bottom: 6px;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const CategoryName = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
  text-transform: capitalize;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CategoryChange = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: ${props => props.isPositive ? '#27ae60' : '#e74c3c'};

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const CategoryDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const AmountDetail = styled.span`
  font-weight: 500;
`;

const Summary = ({ summary, month1Name, month2Name, year1, year2 }) => {
  const { total1, total2, topExpenseDiff, categoryDifferences = [] } = summary;
  const { expenseType, amountDiff } = topExpenseDiff;

  // Calculate additional metrics
  const difference = total2 - total1;
  const percentChange = total1 > 0 ? ((difference / total1) * 100).toFixed(1) : 0;
  const isIncrease = difference > 0;

  // Get days in each month for average calculation
  const getDaysInMonth = (monthName) => {
    const monthMap = {
      'January': 31, 'February': 28, 'March': 31, 'April': 30,
      'May': 31, 'June': 30, 'July': 31, 'August': 31,
      'September': 30, 'October': 31, 'November': 30, 'December': 31
    };
    return monthMap[monthName] || 30;
  };

  const days1 = getDaysInMonth(month1Name);
  const days2 = getDaysInMonth(month2Name);
  const avgDaily1 = total1 / days1;
  const avgDaily2 = total2 / days2;
  const avgDailyDiff = avgDaily2 - avgDaily1;

  return (
    <SummaryContainer>
      <SummaryHeader>📊 Comparison Summary: {month1Name} {year1} vs {month2Name} {year2}</SummaryHeader>

      <SummaryGrid>
        <SummaryCard color="#3498db">
          <CardTitle>Total Spending</CardTitle>
          <CardValue>{month1Name} {year1}: ₹{total1.toLocaleString('en-IN')}</CardValue>
          <CardValue>{month2Name} {year2}: ₹{total2.toLocaleString('en-IN')}</CardValue>
          <CardSubtitle>
            Difference: ₹{Math.abs(difference).toLocaleString('en-IN')}
            <TrendIndicator isPositive={isIncrease}>
              ({isIncrease ? '+' : '-'}{percentChange}%)
            </TrendIndicator>
          </CardSubtitle>
        </SummaryCard>

        <SummaryCard color="#e74c3c">
          <CardTitle>Average Daily Spending</CardTitle>
          <CardValue color="#2c3e50">{month1Name} {year1}: ₹{avgDaily1.toFixed(0).toLocaleString('en-IN')}</CardValue>
          <CardValue color="#2c3e50">{month2Name} {year2}: ₹{avgDaily2.toFixed(0).toLocaleString('en-IN')}</CardValue>
          <CardSubtitle>
            {avgDailyDiff >= 0 ? '+' : ''}₹{avgDailyDiff.toFixed(0).toLocaleString('en-IN')} per day
          </CardSubtitle>
        </SummaryCard>

        <SummaryCard color="#27ae60">
          <CardTitle>Top Category Change</CardTitle>
          <CardValue color="#2c3e50">{expenseType}</CardValue>
          <CardSubtitle>
            {amountDiff >= 0 ? '+' : ''}₹{Math.abs(amountDiff).toLocaleString('en-IN')}
            <TrendIndicator isPositive={amountDiff > 0}>
              ({amountDiff > 0 ? '↑' : amountDiff < 0 ? '↓' : '→'})
            </TrendIndicator>
          </CardSubtitle>
        </SummaryCard>

        <SummaryCard color="#f39c12">
          <CardTitle>Spending Trend</CardTitle>
          <CardValue color={isIncrease ? '#e74c3c' : '#27ae60'}>
            {isIncrease ? '📈 Increased' : '📉 Decreased'}
          </CardValue>
          <CardSubtitle>
            {isIncrease ? 'Higher spending this month' : 'Lower spending this month'}
          </CardSubtitle>
        </SummaryCard>
      </SummaryGrid>

      {categoryDifferences.length > 0 && (
        <CategoryComparison>
          <h4 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            📋 Category-wise Changes
          </h4>
          <CategoryList>
            {categoryDifferences.slice(0, 6).map((category, index) => {
              const percentChange = category.amount1 > 0 ? ((category.difference / category.amount1) * 100).toFixed(1) : 0;
              return (
                <CategoryItem key={index} isPositive={category.difference > 0}>
                  <CategoryHeader>
                    <CategoryName>{category.expenseType}</CategoryName>
                    <CategoryChange isPositive={category.difference > 0}>
                      {category.difference >= 0 ? '+' : ''}₹{Math.abs(category.difference).toLocaleString('en-IN')}
                    </CategoryChange>
                  </CategoryHeader>
                  <CategoryDetails>
                    <AmountDetail>
                      {month1Name} {year1}: ₹{category.amount1.toLocaleString('en-IN')}
                    </AmountDetail>
                    <AmountDetail>
                      {month2Name} {year2}: ₹{category.amount2.toLocaleString('en-IN')}
                    </AmountDetail>
                    <AmountDetail>
                      {category.difference >= 0 ? '+' : ''}{percentChange}%
                    </AmountDetail>
                  </CategoryDetails>
                </CategoryItem>
              );
            })}
          </CategoryList>
        </CategoryComparison>
      )}
    </SummaryContainer>
  );
};

export default Summary;
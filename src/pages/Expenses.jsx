import { Outlet } from 'react-router-dom';
import ExpenseNavbar from '../ui/ExpenseNavbar';


const Expenses = () => {
  return (
    <div>
      <ExpenseNavbar />
      
      <div style={{ marginTop: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
};

export default Expenses

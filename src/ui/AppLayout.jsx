import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";

function AppLayout({ theme, toggleTheme }) {
  return (
    <div className="min-h-screen bg-main">
      <Sidebar />

      <div className="lg:ml-56 flex flex-col min-h-screen">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 p-3 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default AppLayout;

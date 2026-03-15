import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaExchangeAlt,
  FaChartBar,
  FaRobot,
} from "react-icons/fa";

const navItems = [
  { to: "add-expense", icon: FaPlus, label: "Add" },
  { to: "view-expense", icon: FaEye, label: "View" },
  { to: "compare", icon: FaExchangeAlt, label: "Compare" },
  { to: "analysis", icon: FaChartBar, label: "Analysis" },
  { to: "ai-insights", icon: FaRobot, label: "AI" },
];

const ExpenseNavbar = () => {
  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-center px-2">
        <nav
          className="flex gap-2 
          bg-[var(--bg-surface)] 
          backdrop-blur-md 
          border border-[var(--border-color)]/40
          rounded-2xl 
          shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          px-2 py-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-[0_6px_18px_rgba(99,102,241,0.5)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--color-bg-accent)]"
                  }
                `
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="md:hidden fixed bottom-11 left-0 right-0 z-50 
        bg-[var(--bg-surface)] 
        border-t border-[var(--border-color)]/40
        shadow-[0_-10px_25px_rgba(0,0,0,0.25)]"
      >
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                  flex flex-col items-center text-xs transition
                  ${
                    isActive
                      ? "text-indigo-500"
                      : "text-[var(--text-secondary)]"
                  }
                `
                }
              >
                <Icon className="text-lg mb-1" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ExpenseNavbar;

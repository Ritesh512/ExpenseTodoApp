import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

function Header({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const auth = localStorage.getItem("user");
  const user = auth ? JSON.parse(auth) : {};

  const username = user.username?.split(" ")[0] || "User";

  const currentTabName = location.pathname.split("/")[1] || "dashboard";

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  function goToSettings() {
    navigate("/settings");
    setOpen(false);
  }

  return (
    <header
      className="w-full px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40"
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-color)",
        color: "var(--text-primary)",
      }}
    >
      {/* MOBILE LOGO */}
      <div className="lg:hidden">
        <Logo />
      </div>

      {/* DESKTOP PAGE TITLE */}
      <h1 className="hidden lg:block text-lg font-semibold uppercase">
        {currentTabName}
      </h1>

      <div className="flex items-center gap-3">
        {/* THEME BUTTON */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:opacity-80 transition"
        >
          {theme === "dark" ? (
            <HiOutlineSun size={22} />
          ) : (
            <HiOutlineMoon size={22} />
          )}
        </button>

        {/* USER MENU */}
        <div className="relative flex items-center gap-2">
          {/* MOBILE SETTINGS ICON */}
          <button onClick={goToSettings} className="lg:hidden">
            <HiOutlineCog6Tooth size={22} />
          </button>

          {/* MOBILE LOGOUT */}
          <button onClick={logout} className="lg:hidden">
            <HiOutlineArrowRightOnRectangle size={24} />
          </button>

          {/* DESKTOP USER ICON */}
          <button onClick={() => setOpen(!open)} className="hidden lg:block">
            <HiOutlineUserCircle size={30} />
          </button>

          {/* DESKTOP DROPDOWN */}
          {open && (
            <div
              className="absolute right-0 mt-40 w-44 rounded-lg shadow-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="px-4 py-2 text-sm border-b"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {username}
              </div>

              <button
                onClick={goToSettings}
                className="w-full text-left px-4 py-2 text-sm hover:opacity-80 flex items-center gap-2"
              >
                <HiOutlineCog6Tooth size={16} />
                Settings
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm hover:opacity-80 flex items-center gap-2"
              >
                <HiOutlineArrowRightOnRectangle size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

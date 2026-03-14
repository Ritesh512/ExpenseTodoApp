import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";
import { FcTodoList } from "react-icons/fc";
import { GiReceiveMoney } from "react-icons/gi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

function MainNav({ mobile }) {
  const baseClass =
    "flex items-center justify-center gap-2 py-3 rounded-md text-secondary transition";

  const activeClass = "bg-main text-primary";

  return (
    <nav className="w-full">
      <ul
        className={
          mobile
            ? "flex w-full items-center justify-between"
            : "flex flex-col gap-1"
        }
      >
        <li className={mobile ? "flex-1 text-center" : ""}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${baseClass} ${mobile ? "flex-col" : ""} ${isActive ? activeClass : ""}`
            }
          >
            <HiOutlineHome size={22} />
            {!mobile && <span>Home</span>}
          </NavLink>
        </li>

        <li className={mobile ? "flex-1 text-center" : ""}>
          <NavLink
            to="/todo/default"
            className={({ isActive }) =>
              `${baseClass} ${mobile ? "flex-col" : ""} ${isActive ? activeClass : ""}`
            }
          >
            <FcTodoList size={22} />
            {!mobile && <span>Todo</span>}
          </NavLink>
        </li>

        <li className={mobile ? "flex-1 text-center" : ""}>
          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `${baseClass} ${mobile ? "flex-col" : ""} ${isActive ? activeClass : ""}`
            }
          >
            <GiReceiveMoney size={22} />
            {!mobile && <span>Expenses</span>}
          </NavLink>
        </li>

        <li className={mobile ? "flex-1 text-center" : ""}>
          <NavLink
            to="/birthday"
            className={({ isActive }) =>
              `${baseClass} ${mobile ? "flex-col" : ""} ${isActive ? activeClass : ""}`
            }
          >
            <LiaBirthdayCakeSolid size={22} />
            {!mobile && <span>Birthday</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MainNav;

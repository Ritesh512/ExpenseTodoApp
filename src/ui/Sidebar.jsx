import Logo from "./Logo";
import MainNav from "./MainNav";

function Sidebar() {
  return (
    <aside
      className="
      hidden lg:flex flex-col w-56 h-screen
      border-r
      p-4
      fixed left-0 top-0
      "
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-color)",
        color: "var(--text-primary)",
      }}
    >
      <Logo />

      <div className="flex-1 mt-6">
        <MainNav />
      </div>
    </aside>
  );
}

export default Sidebar;

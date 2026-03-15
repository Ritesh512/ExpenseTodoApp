import MainNav from "./MainNav";

function BottomNav() {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 border-t shadow-lg"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <MainNav mobile />
    </div>
  );
}

export default BottomNav;

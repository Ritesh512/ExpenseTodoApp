import logo from "../assets/images/Dollar Symbol.gif";
function Logo() {
  return (
    <div className="flex items-center  ">
      <img src={logo} alt="Logo" className="h-10 w-auto " />
      {/* Hide name on mobile */}
      <span className="hidden lg:block text-2xl font-semibold text-primary">
        Expense App
      </span>
    </div>
  );
}

export default Logo;

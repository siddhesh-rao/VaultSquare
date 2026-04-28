import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import WalletButton from "../ui/WalletButton";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `transition ${isActive ? "text-white" : "text-slate-400 hover:text-white"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-white">
            VaultSquare
          </Link>
          <WalletButton />
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart ({items.length})
          </NavLink>

          {user ? (
            <>
              <NavLink to={user.role === "admin" ? "/admin" : "/dashboard"} className={navLinkClass}>
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </NavLink>
              <button type="button" className="button-secondary !px-4 !py-2" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="button-primary !px-4 !py-2">
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

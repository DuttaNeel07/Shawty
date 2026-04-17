import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">pb</span>
        <span className="navbar-dot">.</span>
        <span className="navbar-domain">pointblank.club</span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <span className="navbar-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          <span className="navbar-name">{user?.name || user?.email}</span>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

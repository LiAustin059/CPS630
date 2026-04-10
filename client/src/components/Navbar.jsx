import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-800 px-6 md:px-35 py-4 flex justify-between items-center fixed top-0 right-0 left-0 bg-[#0f172a] z-50">
      <h1 className="text-sm md:text-xl font-semibold tracking-tight text-gray-200">
        <Link to="/">EventHub</Link>
      </h1>
      <div className="flex items-center gap-4 md:gap-6 text-sm text-gray-400">
        <Link className="hover:text-white cursor-pointer" to="/">Explore</Link>
        {user ? (
          <>
            <Link className="hover:text-white cursor-pointer" to="/create">Create</Link>
            <Link className="hover:text-white cursor-pointer" to="/delete">Delete</Link>
            <Link className="hover:text-white cursor-pointer hidden md:inline" to="/profile">Profile</Link>
            <button onClick={handleLogout} className="hover:text-white cursor-pointer">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-white cursor-pointer" to="/login">Sign in</Link>
            <Link className="hover:text-white cursor-pointer" to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

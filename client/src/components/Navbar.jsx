import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-800 px-6 md:px-35 py-4 flex justify-between items-center fixed top-0 right-0 left-0 bg-[#0f172a] z-50">
      <h1 className="text-sm md:text-xl font-semibold tracking-tight text-gray-200">
        <Link to="/">EventHub</Link>
      </h1>
      <div className="flex gap-6 text-sm text-gray-400">
        <Link className="hover:text-white cursor-pointer" to="/">Explore</Link>
        <Link className="hover:text-white cursor-pointer" to="/create">Create</Link>
        <Link className="hover:text-white cursor-pointer" to="/delete">Delete</Link>
        <span className="hover:text-white cursor-pointer hidden md:inline">Profile</span>
      </div>
    </nav>
  );
}

export default Navbar;

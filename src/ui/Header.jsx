import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { title: "Blogs", path: "/blogs", active: true },
    { title: "Write", path: "/create", active: authStatus },
    { title: "Dashboard", path: "/dashboard", active: authStatus },
    { title: "Sign in", path: "/signin", active: !authStatus },
  ];

  return (
    <header className="py-2 md:py-4 px-4 md:px-28 bg-white shadow-md">
      <nav className="max-w-full mx-auto ">
  
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Link to="/" className="text-xl md:text-2xl font-bold text-slate-900">
              Blogify
            </Link>
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>

         
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

         
          <ul className="hidden md:flex space-x-4 items-center">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.title}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-slate-700 hover:text-slate-900 font-medium px-2 py-1"
                    >
                      {item.title}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </div>

      
        <div className="md:hidden mt-2">
          <SearchBar />
        </div>

        
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="flex flex-col space-y-2 items-center">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.title}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left text-slate-700 hover:text-slate-900 font-medium px-2 py-2 hover:bg-slate-50 rounded"
                      >
                        {item.title}
                      </button>
                    </li>
                  )
              )}
              {authStatus && (
                <li className="px-2">
                  <LogoutButton />
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
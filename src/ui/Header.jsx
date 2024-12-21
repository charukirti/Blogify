import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { status } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { title: "Blogs", path: "/blogs", active: status },
    { title: "Write", path: "/create", active: status },
    { title: "Dashboard", path: "/dashboard", active: status },
  ];

  return (
    <header className="py-2 md:py-4 px-4 md:px-28 bg-white shadow-md sticky top-0 z-10">
      <nav className="max-w-full mx-auto ">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-8">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-slate-900"
            >
              Blogify
            </Link>
            {status && (
              <div className="hidden md:block">
                <SearchBar />
              </div>
            )}
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

            {status && (
              <li>
                <LogoutButton />
              </li>
            )}

            {!status && (
              <li>
                <button className="bg-slate-950 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-lg" onClick={() => navigate("/signin")}>
                  Sign in
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="md:hidden mt-4">
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
              {status && (
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

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { avatar } from "../services/appwrite";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";

export default function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems = [
    { title: "Blogs", path: "/blogs" },
    { title: "Write", path: "/create" },
  ];

  const dropdownItems = [
    { title: "Profile", path: "/profile" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Settings", path: "/settings" },
  ];

  return (
    <header className="bg-neutral-800 py-4">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-white">
              Blogify
            </Link>

            <SearchBar />
          </div>

          <div className=" flex items-center gap-6">
            {status &&
              menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="text-gray-300 hover:text-white"
                >
                  {item.title}
                </button>
              ))}

            {status ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={
                      userData?.email ? avatar.getInitials(userData.email) : ""
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-8 px-5 w-60 bg-neutral-800 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-neutral-700">
                      <p className="text-sm text-white">{userData?.name}</p>
                      <p className="text-xs text-gray-400">{userData?.email}</p>
                    </div>
                    {dropdownItems.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          navigate(item.path);
                          setIsProfileOpen(false);
                        }}
                        className="w-full my-1 p-2 rounded-md text-left text-gray-300 hover:bg-neutral-700"
                      >
                        {item.title}
                      </button>
                    ))}
                    <LogoutButton />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

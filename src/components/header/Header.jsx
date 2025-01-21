import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { avatar } from "../../services/appwrite";
import LogoutButton from "./LogoutButton";
import SearchBar from "./SearchBar";
import { getUser } from "../../store/authSlice";

export default function Header() {
  const { status, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const menuItems = [{ title: "Write", path: "/create" }];

  const dropdownItems = [
    { title: "Home", path: "/" },
    { title: "Profile", path: "/profile" },
    { title: "Dashboard", path: "/dashboard" },
  ];

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-40 mx-auto max-w-[90rem] rounded-full bg-neutral-800 py-4">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-white md:text-3xl">
              Blogify
            </Link>

            <SearchBar />
          </div>

          <div className="flex items-center gap-6">
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={
                      userData?.email ? avatar.getInitials(userData?.email) : ""
                    }
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg bg-neutral-800 px-5 shadow-lg">
                      <div className="border-b border-neutral-700 p-2">
                        <p className="text-sm text-white">{userData?.name}</p>
                        <p className="text-xs text-gray-400">
                          {userData?.email}
                        </p>
                      </div>
                      {dropdownItems.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => {
                            navigate(item.path);
                            setIsProfileOpen(false);
                          }}
                          className="my-1 w-full rounded-md p-2 text-left text-gray-300 hover:bg-neutral-700"
                        >
                          {item.title}
                        </button>
                      ))}
                      <LogoutButton />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
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

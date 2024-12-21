import { useDispatch } from "react-redux";
import authservice from "../services/auth";
import { logout } from "../store/authSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  function handleLogout() {
    authservice.logOut().then(() => {
      dispatch(logout());
    });
  }
  return (
    <button
      onClick={handleLogout}
      className="bg-slate-950 hover:bg-slate-800 text-slate-200 px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}

import { useDispatch } from "react-redux";
import authservice from "../../services/auth";
import { logout } from "../../store/authSlice";

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
      className="text-1xl mb-1 w-full rounded-md py-2 text-slate-200 hover:bg-red-600"
    >
      Logout
    </button>
  );
}

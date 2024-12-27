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
      className=" hover:bg-red-600 text-slate-200 w-full py-2 mb-1 rounded-md text-1xl"
    >
      Logout
    </button>
  );
}

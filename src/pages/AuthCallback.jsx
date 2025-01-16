import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import authservice from "../services/auth";
import { login } from "../store/authSlice";
import Loader from "../components/Loader";
import { getErrorMessage } from "../utils/getAuthErrors";

export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const userData = await authservice.getCurrentUser();
        if (userData) {
          dispatch(login({ userData }));
          navigate("/", { replace: true });
        } else {
          throw new Error("No user data found");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(getErrorMessage(error));
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 3000);
      }
    };

    verifySession();
  }, [navigate, dispatch]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-200">{error}</p>
          <p className="text-sm text-gray-300 mt-2">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader />
      <p className="text-lg text-gray-300 mt-4">Completing authentication...</p>
    </div>
  );
}

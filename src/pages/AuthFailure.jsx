import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, [navigate]);

  return (
    <div className="text-red-400">
      <h2>Authentication Failed</h2>
      <p>Sorry, we couldn&apos;t log you in. Redirecting to login page...</p>
    </div>
  );
}

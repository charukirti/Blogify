import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children, isAuthenticated = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(
    function () {
      if (isAuthenticated && authStatus !== isAuthenticated) {
        navigate("/signin");
      } else if (!isAuthenticated && authStatus !== isAuthenticated) {
        navigate("/");
      }

      setLoader(false);
    },
    [authStatus, isAuthenticated, navigate]
  );
  return loader ? <p>Loading...</p> : <>{children}</>;
}

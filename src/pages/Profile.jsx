import { useEffect, useState } from "react";
import authservice from "../services/auth";
import { useSelector } from "react-redux";
import { avatar } from "../services/appwrite";
import Loader from "../components/Loader";

export default function Profile() {
  const { userData } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserDetails() {
      setLoading(true);
      try {
        if (userData) {
          setUser(userData);
        } else {
          const currentUser = await authservice.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        setError("Failed to fetchUserDetails");
        console.log("Failed to fetchUserDetails", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails()
  }, [userData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="mt-4 px-4 lg:mt-8 lg:px-16">
      <div className="text-center">
        <h1 className="text-2xl lg:text-4xl text-white font-bold border-b pb-2">
          Profile
        </h1>
      </div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="rounded-full overflow-hidden border-2 border-gray-500">
            <img
              src={
                user?.email
                  ? avatar.getInitials(user?.email)
                  : "/default-avatar.png"
              }
              alt={`Avatar of ${user?.name || "User"}`}
              className="w-24 h-24 lg:w-32 lg:h-32"
            />
          </div>
          <div className="mt-4 space-y-2 text-center">
            <p className="text-lg lg:text-xl text-gray-300">
              <span className="font-semibold text-white">Username:</span>{" "}
              {user?.name || "Guest"}
            </p>
            <p className="text-lg lg:text-xl text-gray-300">
              <span className="font-semibold text-white">Email:</span>{" "}
              {user?.email || "No email available"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

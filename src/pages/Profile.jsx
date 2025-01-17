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
    fetchUserDetails();
  }, [userData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="mt-4 px-4 lg:mt-8 lg:px-16">
      <div className="text-center">
        <h1 className="border-b pb-2 text-2xl font-bold text-white lg:text-4xl">
          Profile
        </h1>
      </div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="overflow-hidden rounded-full border-2 border-gray-500">
            <img
              src={
                user?.email
                  ? avatar.getInitials(user?.email)
                  : "/default-avatar.png"
              }
              alt={`Avatar of ${user?.name || "User"}`}
              className="h-24 w-24 lg:h-32 lg:w-32"
            />
          </div>
          <div className="mt-4 space-y-2 text-center">
            <p className="text-lg text-gray-300 lg:text-xl">
              <span className="font-semibold text-white">Username:</span>{" "}
              {user?.name || "Guest"}
            </p>
            <p className="text-lg text-gray-300 lg:text-xl">
              <span className="font-semibold text-white">Email:</span>{" "}
              {user?.email || "No email available"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

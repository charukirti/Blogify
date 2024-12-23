import { useEffect, useState } from "react";
import authservice from "../services/auth"; // Import your AuthService class
import { avatar } from "../services/appwrite"; // Import Appwrite's avatar service

export default function Avatar() {
  const [user, setUser] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await authservice.getCurrentUser();
        setUser(userData);

        const avatarImage = avatar.getInitials(userData.email).toString();
        setAvatarURL(avatarImage);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="p-4 max-w-sm mx-auto border rounded-md shadow flex">
      <div className="flex items-center flex-col space-y-4">
        {/* User Avatar */}
        <div className="w-10 h-16 rounded-full overflow-hidden border">
          {avatarURL ? (
            <img
              src={avatarURL}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-bold">
                {user.name ? user.name[0] : "?"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

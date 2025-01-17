import { useState } from "react";
import googleLogo from "../../assets/google.svg";

export default function SigninWithGoogle({ onOAuthLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onOAuthLogin();
    } catch (error) {
      console.error("Google signin failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`flex max-w-md items-center justify-center gap-2 px-6 py-2 ${isLoading ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-500"} relative w-72 rounded-lg transition-colors`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-white" />
          <span className="text-gray-200">Connecting...</span>
        </div>
      ) : (
        <>
          <img src={googleLogo} alt="google" className="w-6" />
          <p className="text-lg font-medium text-gray-300">
            Continue with Google
          </p>
        </>
      )}
    </button>
  );
}

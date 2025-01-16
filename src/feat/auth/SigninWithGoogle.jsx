import { useState } from 'react';
import googleLogo from "../../assets/google.svg";

export default function SigninWithGoogle({ onOAuthLogin }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            await onOAuthLogin();
        } catch (error) {
            console.error('Google signin failed:', error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            className={`flex items-center justify-center gap-2 max-w-md px-6 py-2 
                ${isLoading ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-500'} 
                w-72 rounded-lg transition-colors relative`}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
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
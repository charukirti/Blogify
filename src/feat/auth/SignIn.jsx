import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import authservice from "../../services/auth";
import { login as authLogin } from "../../store/authSlice";
import { getErrorMessage } from "../../utils/getAuthErrors";
import SigninWithGoogle from "./SigninWithGoogle";

export default function SignIn() {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setError("");

    const { email, password } = data;

    try {
      const session = await authservice.login(email, password);

      if (session) {
        const userData = await authservice.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    }
  };

  async function handleOAuthLogin() {
    await authservice.logInWithGoogle();
  }

  return (
    <div className="mx-auto mt-20 flex max-w-md flex-col items-center justify-center gap-4 rounded-lg bg-neutral-700 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="font-inter mb-6 text-center text-xl font-bold text-white lg:text-4xl">
          Welcome Back to Blogify
        </h1>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Your Email"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="Your Password"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <p className="my-5 text-right text-gray-200">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign up
          </Link>
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 py-2 text-xl font-semibold text-white hover:bg-violet-500"
        >
          Sign in
        </button>
        {error && <p className="mt-8 text-center text-red-600">{error}</p>}
      </form>

      <h3 className="text-2xl font-bold text-white">OR</h3>
      <SigninWithGoogle onOAuthLogin={handleOAuthLogin} />
    </div>
  );
}

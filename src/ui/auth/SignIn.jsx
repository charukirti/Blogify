import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import authservice from "../../services/auth";
import { login as authLogin } from "../../store/authSlice";

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
          dispatch(authLogin(userData));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-inter font-bold text-white mb-6 text-center">
        Blogify
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg shadow-2xl p-6 bg-neutral-700"
      >
        <h2 className="text-4xl font-inter font-bold text-gray-200 mb-6 text-center">
          Sign in to continue
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200 mb-2"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200 mb-2"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <p className="text-right my-5 text-gray-200">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign up
          </Link>
        </p>

        <button
          type="submit"
          className="w-full py-2 text-white rounded-lg bg-violet-600 hover:bg-violet-500 font-semibold text-lg"
        >
          Sign in
        </button>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
      </form>
    </div>
  );
}

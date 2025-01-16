// test pass :- Hfdjhj@jfdj1212
import { useState } from "react";
import authservice from "../../services/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { getErrorMessage } from "../../utils/getAuthErrors";
import SigninWithGoogle from "./SigninWithGoogle";

export default function SignUp() {
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

    const { email, password, name } = data;
    try {
      const userData = await authservice.createNewAccount(
        email,
        password,
        name
      );

      if (userData) {
        const userData = await authservice.getCurrentUser();

        if (userData) dispatch(login({ userData }));

        navigate("/");
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
    <div className="mt-20 flex items-center justify-center gap-4 flex-col p-6 mx-auto bg-neutral-700 max-w-md rounded-lg ">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full shadow-xl ">
        <h1 className="text-xl lg:text-4xl font-bold text-white mb-6 text-center">
          Create an Account
        </h1>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Your Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <p className="text-right my-5 text-gray-100">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400">
            Sign in
          </Link>
        </p>

        <button
          type="submit"
          className="w-full py-2 text-xl font-semibold text-white rounded-lg bg-violet-600 hover:bg-violet-500"
        >
          Sign up
        </button>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
      </form>
      <h3 className="text-white text-2xl font-bold">OR</h3>
      <SigninWithGoogle onOAuthLogin={handleOAuthLogin} />
    </div>
  );
}

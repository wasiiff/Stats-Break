/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../services/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterForm = { name: string; email: string; password: string; confirmPassword: string };

export default function Register() {
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...payload } = data;
    try {
      await registerUser(payload).unwrap();
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cricket Stats AI
        </h1>

        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", { required: "Confirm Password is required", validate: (v) => v === password || "Passwords do not match" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

        {error && <p className="text-red-500 text-sm mb-2">{(error as string)?.data?.message || "Registration failed"}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

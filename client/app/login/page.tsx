"use client";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginForm = { email: string; password: string };

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res: any = await login(data).unwrap();
      const roles = res.roles || ["user"];
      dispatch(setCredentials({ token: res.access_token, roles, user: res.user }));
      console.log("User logged in:", { token: res.access_token, roles, user: res.user });
      router.push("/");
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
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {error && <p className="text-red-500 text-sm mb-2">{(error as any)?.data?.message || "Login failed"}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

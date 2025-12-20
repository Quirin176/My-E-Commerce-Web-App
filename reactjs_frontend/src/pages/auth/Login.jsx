import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const success = await login(data);
      if (success) {
        navigate("/home");
      }
    } catch (err) {
      toast.error("Login failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold text-center">Sign In</h2>

      <div>
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      <div>
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Sign In
      </button>
    </form>
  );
}
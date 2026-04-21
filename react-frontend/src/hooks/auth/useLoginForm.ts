import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import type { AxiosError } from "axios";

export function useLoginForm() {
    const { user, login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Login successful!");
            navigate(user?.role === "Admin" ? "/admin/home" : "/home");
        } catch (err) {
            const axiosErr = err as AxiosError;

            const status = axiosErr?.response?.status;

            if (status === 429) {
                const retryAfter = Number(axiosErr.response?.headers?.["retry-after"]) || 60;
                setError(`Too many attempts. Wait ${retryAfter}s`);
                toast.error(`Try again in ${retryAfter} seconds.`);
            }
            else if (status === 401) {
                setError("Invalid email or password");
                toast.error("Invalid email or password.");
            }
            else {
                setError("Login failed. Please try later.");
                toast.error("Login failed.");
            }
        } finally {
            setLoading(false);
        }
    }

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        loading, error,
        handleSubmit
    };
}
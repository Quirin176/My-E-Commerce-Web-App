import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import type { AxiosError } from "axios";
import type { SignupRequest } from "../../types/dto/SignupRequest";

export function useSignupForm() {
    const { signup } = useAuth();

    // Signup form state
    const [form, setForm] = useState<SignupRequest>({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        // Validation
        if (!form.username || !form.email || !form.phone || !form.password || !confirmPassword) {
            setError("Please fill in all fields!");
            return;
        }

        if (form.password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }

        setLoading(true);
        try {
            const success = await signup(form);
            if (success) {
                toast.success("Signup successful!");
                navigate("/auth?mode=login");
            }
        } catch (err: unknown) {
            const axiosErr = err as AxiosError;

            const errorMsg = "Signup failed: " + (axiosErr?.message || "Unknown error");
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return {
        form,
        onChange,
        confirmPassword,
        setConfirmPassword,
        loading,
        error,
        handleSubmit,
    };
}
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { Eye, EyeClosed } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        loading, error,
        handleSubmit
    } = useLoginForm();

    return (
        <div className="flex h-full">
            <div className="w-1/2 p-12 flex flex-col justify-center">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-lg bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                        >
                            {showPassword ? (<Eye size={24} />) : (<EyeClosed size={24} />)}
                        </button>
                    </div>

                    <button className="text-sm text-gray-500 hover:underline block hover:text-gray-700 transition">
                        Forgot Your Password?
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: siteConfig.colors.primarycolor }}
                    >
                        {loading ? "Signing in..." : "SIGN IN"}
                    </button>
                </form>
            </div>

            {/* LOGIN RIGHT */}
            <div
                className="w-1/2 flex flex-col items-center justify-center text-white p-12 rounded-l-[3rem]"
                style={{ background: siteConfig.colors.primarycolor }}
            >
                <h2 className="text-4xl font-bold mb-6">Hello, Friend!</h2>
                <p className="text-center text-lg mb-8 opacity-90">
                    Don't have an account yet? Register with your personal details
                </p>

                <button
                    onClick={onSwitch}
                    className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 active:scale-95 transition duration-300"
                >
                    REGISTER
                </button>
            </div>
        </div >
    );
}
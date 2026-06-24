import { useLoginForm } from "../../hooks/auth/useLoginForm";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        loading, error,
        handleSubmit
    } = useLoginForm();

    return (
        <div className="flex w-full h-full shadow-2xl">

            {/* SIGN IN LEFT */}
            <div className="w-1/2 p-6 flex flex-col justify-center">
                <h2 className="text-4xl font-bold text-center mb-4 text-black">
                    Sign In
                </h2>

                {/* Social icons */}
                <div className="flex gap-4 mb-4 items-center justify-center">
                    <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">🐦</span>
                    <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">📘</span>
                    <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">📷</span>
                    <span className="text-3xl cursor-pointer hover:scale-125 transition-transform duration-300">🔗</span>
                </div>

                <p className="text-black text-center mb-4">or use your email password</p>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {error && <p className="text-red-500">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-none rounded-lg text-black bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg border-none rounded-lg text-black bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer"
                        >
                            {showPassword ? (<Eye size={24} />) : (<EyeClosed size={24} />)}
                        </button>
                    </div>

                    <button className="text-end text-black hover:italic hover:underline block transition cursor-pointer">
                        Forgot Your Password?
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-medium border-2
                        text-white bg-(--brand-primary) hover:bg-white hover:text-(--brand-primary) hover:border-(--brand-primary)
                        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        {loading ? "Signing in..." : "SIGN IN"}
                    </button>
                </form>
            </div>

            {/* SIGN UP RIGHT */}
            <div className="w-1/2 flex flex-col items-center justify-center text-white bg-(--brand-primary) p-8 rounded-l-[3rem]">
                <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                <h3 className="text-2xl font-semibold mb-4">Welcome to Our Store!</h3>

                <p className="text-center text-xl mb-8">
                    Don't have an account yet?
                    <br />Register with your personal details
                </p>

                <button
                    onClick={onSwitch}
                    className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-(--brand-primary) hover:border-(--brand-primary) active:scale-95 transition cursor-pointer duration-300"
                >
                    REGISTER
                </button>
            </div>
        </div >
    );
}
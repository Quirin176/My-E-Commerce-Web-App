import { useSignupForm } from "../../hooks/auth/useSignupForm";
import { siteConfig } from "../../config/siteConfig";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const {
        form,
        onChange,
        confirmPassword,
        setConfirmPassword,
        loading,
        error,
        handleSubmit,
    } = useSignupForm();

    return (
        <div className="flex h-full">
            <div
                className="w-1/2 flex flex-col items-center justify-center text-white p-12 rounded-r-[3rem]"
                style={{ background: siteConfig.colors.primarycolor }}
            >
                <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                <p className="text-center text-lg mb-8 opacity-90">
                    Already have an account? Sign in to continue
                </p>

                <button
                    onClick={onSwitch}
                    className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-blue-600 active:scale-95 transition duration-300"
                >
                    SIGN IN
                </button>
            </div>

            {/* SIGNUP RIGHT */}
            <div className="w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Create an Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        style={{ background: siteConfig.colors.primarycolor }}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
}
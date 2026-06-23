import { useAuth } from "../../../hooks/auth/useAuth";
import toast from "react-hot-toast";

export default function CouponSection() {
    const { user } = useAuth();

    const handleClicking = () => {
        if (!user) {
            toast.error("Please log in first to get coupon");
            return;
        }

        toast.success("Get coupon successfully")
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between font-bold rounded-2xl p-6 sm:p-16 gap-6
        text-white bg-linear-to-r from-(--brand-primary) to-(--brand-secondary)">

            <div className="flex flex-col gap-3">
                <p className="text-lg sm:text-2xl">GET FREE SHIP COUPON</p>

                <h1 className="text-2xl sm:text-4xl">Free shipping on every order over 200.000 VND</h1>

                <p className="text-base sm:text-2xl">
                    Plus 15% off your first month and a weekly
                    <br />
                    recommendation picked just for you.
                </p>
            </div>

            <button
                className="text-lg sm:text-2xl self-start sm:self-center rounded-2xl bg-(--brand-primary) hover:brightness-110 p-3 sm:p-4 transition cursor-pointer"
                onClick={() => handleClicking()}
            >
                Join free!
            </button>

        </div>
    );
}
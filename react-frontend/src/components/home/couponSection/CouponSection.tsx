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
        <div className="flex justify-between font-bold text-white bg-linear-to-r from-(--brand-primary) to-(--brand-secondary) rounded-2xl p-16">

            <div className="flex flex-col gap-4">
                <p className="text-2xl">
                    GET FREE SHIP COUPON
                </p>

                <h1 className="text-4xl">
                    Free shipping on every order over 200.000 VND
                </h1>

                <p className="text-2xl">
                    Plus 15% off your first month and a weekly
                    <br />
                    recommendation picked just for you.
                </p>
            </div>

            <button
                className="text-2xl rounded-2xl bg-linear-to-br from-(--brand-primary) to-(--brand-secondary) hover:bg-linear-to-tl p-4 cursor-pointer"
                onClick={() => handleClicking()}
            >
                Join free!
            </button>

        </div>
    );
}
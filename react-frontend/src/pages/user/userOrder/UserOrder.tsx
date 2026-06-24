import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { orderApi } from "../../../api/user/orderApi";
import { useAuth } from "../../../hooks/auth/useAuth";
import type { OrderResponse } from "../../../types/models/order/OrderResponse";
import LoadingState from "../../../components/pageState/LoadingState";
import OrderDetailView from "../../../components/orders/OrderDetailView";

const PRINT_STYLES = `
  body { font-family: Arial, sans-serif; padding: 24px; background: white; }
  h1, h2, h3, h4 { margin: 0 0 8px; }
  .section { margin-bottom: 20px; }
  .item-row { border-bottom: 1px solid #ddd; padding: 8px 0; display: flex; justify-content: space-between; }
  .total-box { margin-top: 20px; border-top: 2px solid #000; padding-top: 16px; font-size: 18px; font-weight: bold; }
`;

export default function UserOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      if (!user) {
        navigate("/home");
        return;
      }
      setLoading(true);
      try {
        const data = await orderApi.getOrderWithItemsById(orderId);
        setOrder(data);
      } catch {
        toast.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user, navigate]);

  const handlePrint = () => {
    const printContents = document.getElementById("print-area")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
            <html>
                <head>
                    <title>Order #${order?.id} — Invoice</title>
                    <style>${PRINT_STYLES}</style>
                </head>
                <body>${printContents}</body>
            </html>
        `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // --- Guards ---

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login</h1>
        <button
          onClick={() => navigate("/auth?mode=login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <LoadingState
        message="Loading order details…"
        subMessage="Please wait while we fetch the order details."
      />
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toast.success("Invoice download coming soon!")}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Invoice</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <Printer size={20} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <OrderDetailView
        order={order}
      />
    </div>
  );
}
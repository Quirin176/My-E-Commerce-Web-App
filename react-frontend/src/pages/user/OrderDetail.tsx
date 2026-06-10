import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { orderApi } from "../../api/user/orderApi";
import { useAuth } from "../../hooks/auth/useAuth";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import { ORDER_STATUS, ORDER_STATUS_CONFIG, ORDER_TIMELINE_STATUSES, type OrderStatus } from "../../types/orderStatus";
import LoadingState from "../../components/pageState/LoadingState";

const PRINT_STYLES = `
  body { font-family: Arial, sans-serif; padding: 24px; background: white; }
  h1, h2, h3, h4 { margin: 0 0 8px; }
  .section { margin-bottom: 20px; }
  .item-row { border-bottom: 1px solid #ddd; padding: 8px 0; display: flex; justify-content: space-between; }
  .total-box { margin-top: 20px; border-top: 2px solid #000; padding-top: 16px; font-size: 18px; font-weight: bold; }
`;

export default function OrderDetail() {
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
          onClick={() => navigate("/auth/login")}
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

  const isCancelled = order.status === ORDER_STATUS.Cancelled;
  const currentIndex = ORDER_TIMELINE_STATUSES.indexOf(order.status as any);
  const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
  const StatusIcon = statusConfig.icon;

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
          <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
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

      <div id="print-area" className="space-y-6">

        {/* Status card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="font-bold text-gray-800">Order Status</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${statusConfig.badgeColor}`}>
              <StatusIcon size={18} className={statusConfig.iconColor} />
              {order.status}
            </div>
          </div>

          {isCancelled ? (
            <div className="py-4 text-center text-red-600 font-semibold bg-red-50 rounded-lg border border-red-200">
              This order has been cancelled.
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-500">Tracking Progress</h4>

              {/* Step dots + connectors */}
              <div className="flex items-center">
                {ORDER_TIMELINE_STATUSES.map((s, index) => (
                  <React.Fragment key={s}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0
                                                ${index <= currentIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {index + 1}
                    </div>
                    {index < ORDER_TIMELINE_STATUSES.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step labels */}
              <div className="flex justify-between text-xs text-gray-500">
                {ORDER_TIMELINE_STATUSES.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Shipping + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Shipping Information</h3>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>📧 {order.customerEmail}</p>
              <p>📱 {order.customerPhone}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong>{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Order Date:</span>
                <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Total Amount:</span>
                <strong className="text-blue-600 text-lg">
                  {order.totalAmount.toLocaleString()} VND
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.unitPrice.toLocaleString()} VND
                    </p>
                  </div>
                  <p className="font-bold text-gray-800">
                    {item.totalPrice.toLocaleString()} VND
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t-2 flex justify-end">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>{order.totalAmount.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold p-3 bg-blue-50 rounded">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {order.totalAmount.toLocaleString()} VND
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Order Notes</h4>
            <p className="text-blue-700">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
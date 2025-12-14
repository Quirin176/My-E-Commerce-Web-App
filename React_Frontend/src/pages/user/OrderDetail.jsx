import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkoutApi } from "../../api/checkoutApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Printer } from "lucide-react";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      setLoading(true);
      try {
        const data = await checkoutApi.getOrder(parseInt(orderId));
        setOrder(data);
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("Failed to load order details");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId, user, navigate]);

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusTimeline = (status) => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status.toLowerCase());
    
    return statuses.map((s, index) => (
      <div key={s} className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
          index <= currentIndex 
            ? "bg-green-500 text-white" 
            : "bg-gray-300 text-gray-600"
        }`}>
          {index + 1}
        </div>
        {index < statuses.length - 1 && (
          <div className={`flex-1 h-1 mx-2 ${
            index < currentIndex ? "bg-green-500" : "bg-gray-300"
          }`}></div>
        )}
      </div>
    ));
  };

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
      <div className="container mx-auto p-6 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-500 mt-4">Loading order details...</p>
      </div>
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    toast.success("Invoice download feature coming soon!");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadInvoice}
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

      {/* Status */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Order Status</h3>
          <div className={`inline-block px-6 py-3 rounded-full border-2 font-bold capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Tracking Progress</h4>
          <div className="flex gap-1">
            {getStatusTimeline(order.status)}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Pending</span>
            <span>Confirmed</span>
            <span>Shipped</span>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Shipping Address</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>{order.customerName}</strong></p>
            <p>{order.shippingAddress}</p>
            <p>📧 {order.customerEmail}</p>
            <p>📱 {order.customerPhone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Details</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <strong className="capitalize">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="font-semibold">Total Amount:</span>
              <strong className="text-blue-600 text-lg">{order.totalAmount.toLocaleString()} VND</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × {item.unitPrice.toLocaleString()} VND
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {item.totalPrice.toLocaleString()} VND
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-4 pt-4 border-t-2">
            <div className="flex justify-end">
              <div className="w-full md:w-64">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>{order.totalAmount.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-4">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 p-3 bg-blue-50 rounded">
                  <span>Total:</span>
                  <span className="text-blue-600">{order.totalAmount.toLocaleString()} VND</span>
                </div>
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

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          button {
            display: none;
          }
          .print-hide {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { orderApi } from "../../api/user/orderApi";
import { useAuth } from "../../hooks/auth/useAuth";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderResponseModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!user) {
        navigate("/auth/login");
        return;
      }

      setLoading(true);
      try {
        const data = await orderApi.getOrderWithItemsById(orderId);
        setOrder(data);
      } catch (error) {
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

  const getStatusColor = (status: string) => {
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

  const getStatusTimeline = (status: string) => {
    const statuses = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(status.toLowerCase());

    return statuses.map((s, index) => (
      <div key={s} className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${index <= currentIndex
          ? "bg-green-500 text-white"
          : "bg-gray-300 text-gray-600"
          }`}>
          {index + 1}
        </div>
        {index < statuses.length - 1 && (
          <div className={`flex-1 h-1 mx-2 ${index < currentIndex ? "bg-green-500" : "bg-gray-300"
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
    const printContents = document.getElementById("print-area")?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Order #${order?.id} - Invoice</title>
        <style>
          ${printStylesRaw}
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownloadInvoice = () => {
    toast.success("Invoice download feature coming soon!");
  };

  const printStylesRaw = `
  body {
    font-family: Arial, sans-serif;
    padding: 24px;
    background: white;
  }
  h1, h2, h3, h4 {
    margin: 0 0 8px;
  }
  .section {
    margin-bottom: 20px;
  }
  .item-row {
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
  }
  .total-box {
    margin-top: 20px;
    border-top: 2px solid #000;
    padding-top: 16px;
    font-size: 18px;
    font-weight: bold;
  }
`;

  const printStyles = `
  @media print {
      body {
          background: white;
      }
      .print-hide {
          display: none !important;
      }
      button {
          display: none !important;
      }
      .container {
          max-width: 100% !important;
          padding: 0 !important;
      }
      #print-area {
          padding: 20px;
      }
  }
`;

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

      <div id="print-area">

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-row items-center gap-4">
            <h3 className="font-bold text-gray-800">Order Status</h3>
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
            <h3 className="font-bold text-lg text-gray-800 mb-4">Shipping Information</h3>
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
                <strong>{order.paymentMethod}</strong>
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
              {order.items.map(item => (
                <div key={item.productId} className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity} × {item.unitPrice.toLocaleString()} VND</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{item.totalPrice.toLocaleString()} VND</p>
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
      </div>

      {/* Print Styles */}
      <style>{printStyles}</style>
    </div>
  );
}

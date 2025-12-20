import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { checkoutApi } from "../../api/checkoutApi";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation

  // Shipping Info
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: ""
  });

  // Payment Info
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "card" // card or cod (cash on delivery)
  });

  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);

  // Redirect if not logged in or cart is empty
  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login First</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to checkout</p>
        <button
          onClick={() => navigate("/auth/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (cart.length === 0 && !orderCreated) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
        !shippingInfo.address || !shippingInfo.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate payment info
      if (paymentInfo.paymentMethod === "card") {
        if (!paymentInfo.cardName || !paymentInfo.cardNumber || 
            !paymentInfo.expiryDate || !paymentInfo.cvv) {
          toast.error("Please fill in all card details");
          setLoading(false);
          return;
        }
      }

      // Create order object
      const orderData = {
        customerName: shippingInfo.fullName,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city} ${shippingInfo.postalCode}`,
        city: shippingInfo.city,
        totalAmount: total,
        paymentMethod: paymentInfo.paymentMethod,
        orderItems: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.price * item.qty
        })),
        status: "Pending",
        notes: ""
      };

      // Create the order
      const createdOrder = await checkoutApi.createOrder(orderData);
      
      if (paymentInfo.paymentMethod === "card") {
        // For demo, we'll just simulate payment
        // In production, integrate with Stripe Elements
        toast.success("Payment processing... (Demo Mode)");
        
        // Simulate payment confirmation
        setTimeout(() => {
          setOrderCreated(createdOrder);
          clearCart();
          setStep(3);
        }, 2000);
      } else {
        // COD - Order created without payment
        setOrderCreated(createdOrder);
        clearCart();
        setStep(3);
        toast.success("Order placed successfully! Pay on delivery");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Shipping Information
  if (step === 1) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="0123456789"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block font-semibold mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="123 Main St"
                  />
                </div>

                {/* City, District, Ward */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ho Chi Minh"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">District</label>
                    <input
                      type="text"
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleShippingChange}
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="District 1"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Ward</label>
                    <input
                      type="text"
                      name="ward"
                      value={shippingInfo.ward}
                      onChange={handleShippingChange}
                      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ward 1"
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block font-semibold mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="70000"
                  />
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-6"
                >
                  Continue to Payment
                  <ChevronRight size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 border-b pb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} <span className="text-gray-500">x{item.qty}</span>
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.qty).toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{total.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">{total.toLocaleString()} VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Payment Information
  if (step === 2) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 rounded cursor-pointer hover:bg-blue-50" 
                    style={{ borderColor: paymentInfo.paymentMethod === "card" ? "#2563eb" : "#ddd" }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentInfo.paymentMethod === "card"}
                      onChange={handlePaymentChange}
                      className="mr-3"
                    />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center p-4 border-2 rounded cursor-pointer hover:bg-blue-50"
                    style={{ borderColor: paymentInfo.paymentMethod === "cod" ? "#2563eb" : "#ddd" }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentInfo.paymentMethod === "cod"}
                      onChange={handlePaymentChange}
                      className="mr-3"
                    />
                    <span className="font-semibold">Cash on Delivery (COD)</span>
                  </label>
                </div>

                {/* Card Details - Show only if card is selected */}
                {paymentInfo.paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded">
                    <div>
                      <label className="block font-semibold mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          setPaymentInfo(prev => ({ 
                            ...prev, 
                            cardNumber: value.replace(/(\d{4})/g, '$1 ').trim() 
                          }));
                        }}
                        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            let formatted = value;
                            if (value.length >= 2) {
                              formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setPaymentInfo(prev => ({ ...prev, expiryDate: formatted }));
                          }}
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setPaymentInfo(prev => ({ ...prev, cvv: value }));
                          }}
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Note for COD */}
                {paymentInfo.paymentMethod === "cod" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 font-semibold">
                      ✓ You will pay the full amount upon delivery
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-300 py-3 rounded font-bold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} <span className="text-gray-500">x{item.qty}</span>
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.qty).toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{total.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">{total.toLocaleString()} VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Order Confirmation
  if (step === 3 && orderCreated) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-block bg-green-100 rounded-full p-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase</p>

          {/* Order Details */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold">{orderCreated.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-blue-600">{total.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-bold capitalize">
                  {paymentInfo.paymentMethod === "card" ? "Credit Card" : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-yellow-600">Pending</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-bold mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Order confirmation email has been sent</li>
              <li>✓ We are processing your order</li>
              <li>✓ You will receive tracking information shortly</li>
              <li>✓ Visit your Orders page to track shipment</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 border-2 border-gray-300 py-3 rounded font-bold hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
}

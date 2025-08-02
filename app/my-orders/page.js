"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    document.title = "My Orders | My App";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Track and view your previous orders.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Track and view your previous orders.";
      document.head.appendChild(meta);
    }
  }, []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    fetch("/api/my-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, [session]); // Added session as dependency

  // Cancel order function
  const handleCancelOrder = async (orderId) => {
    setCancellingOrders(prev => new Set([...prev, orderId]));
    
    try {
      const response = await fetch("/api/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Immediately remove the cancelled order from the local state for faster UI
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        
        // Close modal immediately
        setShowCancelConfirm(null);
        
        // Show success toast
        toast.success('Order cancelled successfully! You will receive a confirmation email shortly.', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error(result.message || 'Failed to cancel order. Please try again.', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error('Failed to cancel order. Please try again.', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setCancellingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      setShowCancelConfirm(null);
    }
  };

  // Show loading spinner while checking authentication
  if (status === "loading") return <LoadingSpinner />;

  // Show login message if not authenticated
  if (!session) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-2 py-8 sm:px-4 relative"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/vettori-premium/un-muro-con-un-mouse-e-un-portatile-con-un-carrello-della-spesa-e-un-tag-di-sconto-su-uno-sfondo-beige_1174726-9281.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-2xl">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Login to see all your orders
            </p>
          </div>

          <style jsx>{`
            .btn-grad {
              background-image: linear-gradient(
                to right,
                #aa076b 0%,
                #61045f 51%,
                #aa076b 100%
              );
              margin: 10px;
              padding: 15px 45px;
              text-align: center;
              text-transform: uppercase;
              transition: 0.5s;
              background-size: 200% auto;
              color: white;
              box-shadow: 0 0 20px #eee;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              border: none;
              cursor: pointer;
              width: 100%;
              font-weight: 600;
            }

            .btn-grad:hover {
              background-position: right center;
              color: #fff;
              text-decoration: none;
            }
          `}</style>

          <button
            onClick={() => signIn("google", { callbackUrl: "/my-orders" })}
            className="btn-grad"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (!orders.length) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-2 py-8 sm:px-4 relative"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/vettori-premium/un-muro-con-un-mouse-e-un-portatile-con-un-carrello-della-spesa-e-un-tag-di-sconto-su-uno-sfondo-beige_1174726-9281.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Main content */}

        <div className="relative z-10 w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h2>
            
            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
              You haven&apos;t placed any orders yet. Start shopping to see your order history here!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/allProducts'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 
                          font-semibold uppercase tracking-wide rounded-lg 
                          text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl
                         shadow-lg shadow-beige-500/30 
                         transition-all duration-300 ease-in-out 
                         hover:shadow-xl hover:shadow-beige-500/40 hover:-translate-y-0.5 
                         focus:outline-none focus:ring-4 focus:ring-indigo-300/50
                         sm:px-6 sm:py-3 sm:text-sm
                         text-sm"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Start Shopping</span>
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-2.5 
                         bg-transparent border-2 border-indigo-500 text-indigo-600 
                         font-semibold uppercase tracking-wide rounded-lg 
                         transition-all duration-300 ease-in-out 
                          hover:font-bold hover:text-white/80 hover:bg-indigo-500/80 hover:-translate-y-0.5
                         focus:outline-none focus:ring-4 focus:ring-indigo-300/50
                         sm:px-6 sm:py-2.5 sm:text-sm
                         text-sm"
            >
              Browse Homepage
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              Once you place an order, you&apos;ll be able to track its status here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Flatten all products from all orders
  const allProducts = orders.flatMap((order) =>
    order.orderItems.map((item) => ({
      ...item,
      orderId: order._id,
      status: order.status,
      date: order.createdAt,
      total: order.total,
    }))
  );

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-2 py-8 sm:px-4 relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/vettori-premium/un-muro-con-un-mouse-e-un-portatile-con-un-carrello-della-spesa-e-un-tag-di-sconto-su-uno-sfondo-beige_1174726-9281.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlayed My Orders text on background */}
      <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none w-full flex justify-center">
        <span
          className="custom-orders-heading text-[8vw] sm:text-5xl md:text-6xl font-extrabold text-[#e0b97f] drop-shadow-lg opacity-80 tracking-tight text-center px-2 pt-[8%] lg:pt-[3%] md:pt-[3%] sm:pt-[7%]"
          style={{ textShadow: "2px 2px 12px #fff, 0 2px 8px #e0b97f" }}
        >
          My Orders
          <style jsx>{`
            @media (max-width: 470px) {
              .custom-orders-heading {
                padding-top: 18% !important;
              }
            }

            @media (max-width: 267px) {
              .custom-orders-heading {
                padding-top: 25% !important;
              }
            }
          `}</style>
        </span>
      </div>
      <div
        className="w-full max-w-[1200px] h-[80vh] pt-24 sm:pt-32 md:pt-28 rounded-xl pb-2 px-1 sm:px-4 md:px-8 mx-auto relative z-20 flex flex-col"
        style={{ minWidth: "0" }}
      >
        <div className="flex-1 overflow-y-auto pr-1 pt-2 sm:pt-4 flex flex-col items-center">
          <ol className="space-y-3 sm:space-y-6 list-decimal list-inside w-full max-w-4xl">
            {allProducts.map((item, idx) => (
              <li
                key={item.orderId + "-" + idx}
                className={`border-2 rounded-lg p-2 sm:p-4 flex flex-col md:flex-row items-center mx-auto gap-2 w-full max-w-3xl sm:gap-4 ${
                  item.status === "cancelled" 
                    ? "border-red-300 bg-red-50/60 opacity-75" 
                    : "border-white/70 bg-white/40"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.product}
                  width={80}
                  height={80}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded mb-0 sm:mb-0 lg:mb-1 md:mb-0"
                  unoptimized
                />
                <ul className="flex-1 w-[75%] text-center md:text-left space-y-1 text-xs sm:text-sm md:text-md grid grid-cols-2 md:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-1">
                  <li className="font-semibold break-words col-span-2 md:col-span-4">
                    {item.product}
                  </li>
                  <li>
                    Order ID:
                    <br />
                    <span className="text-xs break-all">{item.orderId}</span>
                  </li>
                  <li>
                    Status:
                    <br />
                    <span
                      className={
                        item.status === "completed"
                          ? "text-green-600 font-semibold"
                          : item.status === "cancelled"
                          ? "text-red-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {item.status.toUpperCase()}
                      {item.status === "cancelled" }
                    </span>
                  </li>
                  <li>
                    Date:
                    <br />
                    {new Date(item.date).toLocaleString()}
                  </li>
                  <li>
                    Quantity:
                    <br />
                    {item.quantity}
                  </li>
                  <li>
                    Size:
                    <br />
                    {item.selectedSize}
                  </li>
                  <li>
                    Price:
                    <br />₹{item.price}
                  </li>
                  <li className="mt-1 text-xs md:text-sm col-span-2 md:col-span-4">
                    Order Total: ₹{item.total}
                  </li>
                </ul>
                
                {/* Cancel Order Button */}
                <div className="flex flex-col justify-center ml-2">
                  <button
                    onClick={() => setShowCancelConfirm(item.orderId)}
                    disabled={cancellingOrders.has(item.orderId) || item.status === "cancelled"}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      item.status === "cancelled"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : cancellingOrders.has(item.orderId)
                        ? "bg-orange-300 text-orange-700 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {cancellingOrders.has(item.orderId) 
                      ? "Cancelling..." 
                      : item.status === "cancelled" 
                      ? "Cancelled" 
                      : "Cancel Order"
                    }
                  </button>
                </div>

              </li>
            ))}
          </ol>
          
          {/* Cancel Confirmation Dialog - Outside the list */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-red-400/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-md w-full mx-auto shadow-2xl">
                <p className="text-white text-sm sm:text-base mb-4">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowCancelConfirm(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors font-medium"
                  >
                    No, Keep Order
                  </button>
                  <button
                    onClick={() => handleCancelOrder(showCancelConfirm)}
                    disabled={cancellingOrders.has(showCancelConfirm)}
                    className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 font-medium"
                  >
                    {cancellingOrders.has(showCancelConfirm) ? "Cancelling..." : "Yes, Cancel Order"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

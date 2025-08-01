"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

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

  useEffect(() => {
    fetch("/api/my-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, [session]); // Added session as dependency

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
      <div className="p-8 text-center">
        No orders found.
        <br />
        <div className="mt-4 text-left">
          <div className="font-bold">Debug: Orders from API:</div>
          <pre className="bg-gray-100 p-2 rounded text-xs max-h-64 overflow-auto">
            {JSON.stringify(orders, null, 2)}
          </pre>
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
                className="border-2 border-white/70 rounded-lg p-2 sm:p-4 flex flex-col md:flex-row items-center mx-auto gap-2 w-full max-w-3xl sm:gap-4 bg-white/40 "
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
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {item.status}
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
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

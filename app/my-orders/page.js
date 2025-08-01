"use client";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function MyOrdersPage() {
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
  }, []);

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
          className="custom-orders-heading text-[8vw] sm:text-5xl md:text-6xl font-extrabold md:text-green-500 sm:text-red-500 lg:text-blue-500 text-[#e0b97f] drop-shadow-lg opacity-80 tracking-tight text-center px-2 pt-[8%] lg:pt-[3%] md:pt-[3%] sm:pt-[7%]"
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
        <div className="flex-1 overflow-y-auto pr-1 pt-2 sm:pt-4">
          <ol className="space-y-3 sm:space-y-6 list-decimal list-inside">
            {allProducts.map((item, idx) => (
              <li
                key={item.orderId + "-" + idx}
                className="border-2 border-white/70 rounded-lg p-2 sm:p-4 flex flex-col md:flex-row items-center mx-auto gap-2 w-[73%] sm:gap-4 bg-white/40 "
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

"use client";
import React from "react";
import { useRouter } from "next/navigation";

import  { useEffect, useState } from "react";


const OrderConfirmation = () => {
  useEffect(() => {
    document.title = "Order Confirmation | My App";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Your order has been confirmed. Thank you for shopping with us!");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Your order has been confirmed. Thank you for shopping with us!";
      document.head.appendChild(meta);
    }
  }, []);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch("/api/get-latest-order");
        const data = await res.json();
        setOrder(data.order);
      } catch {}
    }
    fetchOrder();
  }, []);

  return (
    <div className="min-h-screen bg-[#4c2438] flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Order Confirmed!</h2>
        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your payment was successful and your order is being processed.
        </p>
        {order && (
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <p className="text-white text-sm mb-1"><strong>Order ID:</strong> {order.orderId}</p>
            <p className="text-white text-sm mb-1"><strong>Payment ID:</strong> {order.paymentId}</p>
            <p className="text-white text-sm mb-1"><strong>Name:</strong> {order.shippingInfo.fullName}</p>
            <p className="text-white text-sm mb-1"><strong>Email:</strong> {order.shippingInfo.email}</p>
            <p className="text-white text-sm mb-1"><strong>Address:</strong> {order.shippingInfo.address}</p>
            <p className="text-white text-sm mb-1"><strong>City:</strong> {order.shippingInfo.city}</p>
            <p className="text-white text-sm mb-1"><strong>Pincode:</strong> {order.shippingInfo.pincode}</p>
            <p className="text-white text-sm mb-1"><strong>Verified:</strong> {order.verified ? "Yes" : "No"}</p>
          </div>
        )}
        <button
          onClick={() => router.push("/allProducts")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-2"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

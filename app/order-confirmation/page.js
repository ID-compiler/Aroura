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
        
        {/* Email Tip Section */}
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 ">
              <h3 className="text-blue-300 font-semibold text-sm mb-2"> Check Your Email</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                We&apos;ve sent your <strong>order summary</strong> to your email address. 
                <br />
                <span className="text-yellow-200 mb-2 "> If you don&apos;t see it, check your <strong>spam/junk folder</strong></span>
                <br />
                 <em>Mark our emails as &quot;Not Spam&quot; to improve future deliverability</em>
              </p>
            </div>
          </div>
        </div>
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
        <div className="space-y-3">
          <button
            onClick={() => router.push("/my-orders")}
            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br text-white py-3 rounded-lg transition-colors font-semibold"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push("/allProducts")}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br  text-white py-3 rounded-lg  transition-colors font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full  text-white py-3 rounded-lg bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:bg-gradient-to-br  transition-colors font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

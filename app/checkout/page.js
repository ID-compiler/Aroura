"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Checkout | Aroura";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Complete your order and payment securely on the checkout page."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Complete your order and payment securely on the checkout page.";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      try {
        setOrder(JSON.parse(decodeURIComponent(orderParam)));
      } catch {
        setOrder(null);
      }
    }
  }, [searchParams]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          user: {
            fullName,
            address,
            phone,
            email,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.orderId && data.key) {
        if (!window.Razorpay) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: fullName,
          description: "Order Payment",
          order_id: data.orderId,
          handler: async function (response) {
            const verifyRes = await fetch("/api/payment-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            const purchasedIds =
              verifyData?.payment?.orderItems?.map((item) => item._id) || [];
            const purchasedIdSet = new Set([
              ...purchasedIds.map((id) => String(id)),
              ...(verifyData?.payment?.orderItems
                ?.map((item) => String(item.id))
                .filter(Boolean) || []),
            ]);

            if (verifyRes.ok && verifyData.success) {
              toast.success("Thank You for the Purchase!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });

              try {
                await fetch("/api/auth/send-email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: fullName,
                    email,
                    contact: phone,
                    subject: "Order Confirmed - Thank You!",
                    message: `Dear ${fullName},\n\nThank you for your order! Your payment was successful and your order is confirmed.\n\nOrder Details:\n${verifyData?.payment?.orderItems
                      ?.map((item) => `- ${item.product} (x${item.quantity})`)
                      .join("\n")}\n\nBest regards,\nAroura Team`,
                  }),
                });
              } catch (err) {
                console.error("Failed to send thank you email", err);
              }

              let guestCart = JSON.parse(
                localStorage.getItem("guest_cart") || "[]"
              );
              guestCart = guestCart.filter(
                (item) =>
                  !purchasedIdSet.has(String(item._id)) &&
                  !purchasedIdSet.has(String(item.id))
              );
              localStorage.setItem("guest_cart", JSON.stringify(guestCart));

              const session = JSON.parse(
                localStorage.getItem("next-auth.session") || "null"
              );
              if (session?.user?.email) {
                let userCart = JSON.parse(
                  localStorage.getItem(`cart_${session.user.email}`) || "[]"
                );
                userCart = userCart.filter(
                  (item) =>
                    !purchasedIdSet.has(String(item._id)) &&
                    !purchasedIdSet.has(String(item.id))
                );
                localStorage.setItem(
                  `cart_${session.user.email}`,
                  JSON.stringify(userCart)
                );
              }

              window.location.href = "/my-orders";
            } else {
              toast.error(verifyData.error || "Payment verification failed", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
            }
          },
          prefill: {
            name: fullName,
            contact: phone,
          },
          theme: { color: "#38b2ac" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Failed to initiate Payment", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      toast.error("Error processing Order", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Order Summary
        </h2>
        <p className="text-red-600 text-sm">
          No order found. Please proceed from your cart.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1672362978509-2e1ec2b40c50?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="lg:w-2xl w-[70vw] md:w-xl sm:w-lg mx-auto px-3 sm:px-3 md:px-4 lg:px-4 py-6 mt-30 bg-white bg-opacity-90 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Order Summary
        </h2>
        <div className="mb-8 divide-y">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between py-3 text-sm sm:text-base"
            >
              <span className="text-gray-700">
                {item.product} (x{item.quantity})
              </span>
              <span className="font-medium">₹{item.price}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, State, Zip Code"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {loading ? "Processing..." : "Place Order & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Wrap in Suspense for Next.js 15+ static export compatibility
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
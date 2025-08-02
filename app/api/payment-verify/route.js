import connectDb from "@/lib/mongoose";
import Payment from "@/model/Payment";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDb();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: "Missing payment verification data" }, { status: 400 });
    }
    // Verify signature
    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (generated_signature !== razorpay_signature) {
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }
    // Debug logging
    const foundPayments = await Payment.find({});
    // Update payment status in DB
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "completed", done: true },
      { new: true }
    );
    if (!payment) {
      return Response.json({ error: "Order not found", debug: { received: razorpay_order_id, payments: foundPayments.map(p => ({ id: p._id, razorpayOrderId: p.razorpayOrderId })) } }, { status: 404 });
    }
    return Response.json({ success: true, payment });
  } catch (err) {
    return Response.json({ error: err.message || "Failed to verify payment" }, { status: 500 });
  }
}

import Razorpay from "razorpay";
import connectDb from "@/lib/mongoose";
import Payment from "@/model/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await connectDb();
    const { order, user } = await req.json();
    if (!order || !user) {
        return Response.json({ error: "Missing order or user info" }, { status: 400 });
    }

    // Try to get email from session if not provided
    let email = user.email || null;
    if (!email) {
        try {
            const session = await getServerSession(authOptions);
            email = session?.user?.email || null;
        } catch {}
    }

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const razorpayOrder = await instance.orders.create({
        amount: Math.round(order.total * 100), // Razorpay expects paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
    });
    
    // Save order to DB
    const razorpayOrderId = razorpayOrder.id;
    
    // Always save email in shippingInfo
    const shippingInfo = {
        fullName: user.fullName,
        address: user.address,
        phone: user.phone,
        email, // Always use the resolved email variable
    };
    const payment = await Payment.create({
        orderItems: order.items,
        total: order.total,
        shippingInfo,
        razorpayOrderId,
        createdAt: new Date(),
        status: "pending",
        done: false,
    });
    console.log("Saved Payment document:", payment);
    return Response.json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
        key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return Response.json({ error: err.message || "Failed to create Razorpay order" }, { status: 500 });
  }
}

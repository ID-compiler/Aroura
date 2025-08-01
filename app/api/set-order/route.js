import connectDb from "@/lib/mongoose";
import Payment from "@/model/Payment";

export async function POST(req) {
  try {
    await connectDb();
    const { order, user } = await req.json();
    if (!order || !user) {
      return Response.json({ error: "Missing order or user info" }, { status: 400 });
    }
    // Save order to DB
    const payment = await Payment.create({
      orderItems: order.items,
      total: order.total,
      shippingInfo: {
        fullName: user.fullName,
        address: user.address,
        phone: user.phone,
      },
      createdAt: new Date(),
    });
    return Response.json({ success: true, paymentId: payment._id });
  } catch (err) {
    return Response.json({ error: err.message || "Failed to save order" }, { status: 500 });
  }
}

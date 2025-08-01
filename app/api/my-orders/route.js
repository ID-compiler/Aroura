import connectDb from "@/lib/mongoose";
import Payment from "@/model/Payment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  await connectDb();
  // If you use authentication, get user email from session
  let userEmail = null;
  try {
    const session = await getServerSession(authOptions);
    userEmail = session?.user?.email;
  } catch {}
  // If you save user email in Payment, filter by it. Otherwise, return all orders.
  const orders = userEmail
    ? await Payment.find({ "shippingInfo.email": userEmail, status: "completed" }).sort({ createdAt: -1 })
    : await Payment.find({ status: "completed" }).sort({ createdAt: -1 });
  return Response.json({ orders });
}

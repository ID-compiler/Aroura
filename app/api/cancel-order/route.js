import connectDb from "@/lib/mongoose";
import Payment from "@/model/Payment";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    await connectDb();
    
    // Get the session to verify the user
    const session = await getServerSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    
    if (!orderId) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Find the order and verify it belongs to the user
    const order = await Payment.findById(orderId);
    
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the current user
    const userEmail = session.user?.email || session.phone;
    if (order.shippingInfo.email !== userEmail && order.shippingInfo.phone !== session.phone) {
      return Response.json({ error: "Unauthorized to cancel this order" }, { status: 403 });
    }

    // Check if order is already cancelled
    if (order.status === "cancelled") {
      return Response.json({ error: "Order is already cancelled" }, { status: 400 });
    }

    // Update the order status to cancelled
    const updatedOrder = await Payment.findByIdAndUpdate(
      orderId,
      { 
        status: "cancelled",
        cancelledAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return Response.json({ error: "Failed to cancel order" }, { status: 500 });
    }

    // Send cancellation email to customer
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: order.shippingInfo.email,
          subject: "Order Cancellation Confirmation",
          isOrderCancellation: true,
          orderData: {
            orderId: order._id,
            customerName: order.shippingInfo.name,
            orderItems: order.orderItems,
            total: order.total,
            cancelledAt: new Date().toLocaleString(),
          },
        }),
      });

      if (!emailResponse.ok) {
        console.error("Failed to send cancellation email");
      }
    } catch (emailError) {
      console.error("Error sending cancellation email:", emailError);
      // Don't fail the cancellation if email fails
    }

    return Response.json({ 
      success: true, 
      message: "Order cancelled successfully",
      order: updatedOrder 
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return Response.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

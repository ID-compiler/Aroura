import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema({
  // Old fields for compatibility
  oid: { type: String },
  userName: { type: String },
  userNum: { type: Number },
  userAdd: { type: String },
  amount: { type: Number },
  status: { type: String, enum: ["pending", "completed", "failed", "cancelled"], default: "pending" },
  done: {type: Boolean, default: false },
  // New order fields
  orderItems: [{
    product: String,
    quantity: Number,
    deliveryOption: String,
    selectedSize: String,
    price: Number,
    image: String,
  }],
  total: { type: Number },
  shippingInfo: {
    fullName: String,
    address: String,
    phone: String,
    email: String,
  },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
});


export default mongoose.models.Payment || model("Payment", paymentSchema);

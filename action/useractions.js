"use server";
import Razorpay from "razorpay";
import Payment from "@/model/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// Create a Razorpay order and save payment
export const initiate = async (amount, to_username, paymentform) => {
    await connectDb();
    const user = await User.findOne({ username: to_username });
    if (!user?.razorpayid || !user?.razorpaysecret) throw new Error("Missing Razorpay credentials");

    const instance = new Razorpay({
        key_id: user.razorpayid,
        key_secret: user.razorpaysecret
    });

    try {
        const order = await instance.orders.create({
            amount: Number.parseInt(amount),
            currency: "INR"
        });

        await Payment.create({
            oid: order.id,
            amount: amount / 100,
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message
        });

        return order;
    } catch (err) {
        console.error("Razorpay initiation error:", err);
        throw err;
    }
};

// Fetch user by username
export const fetchuser = async (username) => {
    await connectDb();
    const user = await User.findOne({ username });
    return user?.toObject({ flattenObjectIds: true });
};

// Fetch user by email
export const fetchuserByEmail = async (email) => {
    await connectDb();
    const user = await User.findOne({ email });
    return user?.toObject({ flattenObjectIds: true });
};

// Fetch recent payments for a user
export const fetchpayments = async (username) => {
    await connectDb();
    return await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(10).lean();
};

// Update user profile by _id, handle username change, and update payments
export const updateProfile = async (data, oldusername) => {
    console.log(data)
    console.log(oldusername)
    await connectDb();
    const ndata = typeof data.entries === "function" ? Object.fromEntries(data.entries()) : data;
    console.log("ndata: ")
    console.log(ndata)
     console.log("ndata ends")
   // console.log("Updating profile for:", oldusername, "with data:", ndata);

    // if (!ndata._id) {
    //     throw new Error("User _id is required for update.");
    // }

    if (oldusername !== ndata.username) {
        const exists = await User.findOne({ username: ndata.username });
        if (exists) return { error: "Username already exists" };

        const result = await User.updateOne({ _id: ndata._id }, ndata);
        console.log("MongoDB update result:", result);
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.username });
    } else {
        const result = await User.updateOne({ _id: ndata._id }, ndata);
        console.log("MongoDB update result:", result);
    }
    console.log("Profile update complete.");
};
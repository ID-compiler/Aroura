import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, contact, message, subject } = await request.json();

    console.log("📧 Attempting to send email...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS length:",
      process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "undefined"
    );

    // Create Gmail transporter with explicit SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Test the connection first
    console.log("🔍 Testing email connection...");
    await transporter.verify();
    console.log("✅ Email connection verified successfully");

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "work.ichhadwivedi@gmail.com",
      subject: subject || "Message from Arora",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4c2438; text-align: center; margin-bottom: 30px;">Message from Arora</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Contact:</strong> ${contact}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4c2438; margin-bottom: 20px;">
            <h3 style="color: #4c2438; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            <p>This message was sent from your Arora website contact form.</p>
          </div>
        </div>
      `,
      text: `
Message from Arora

Name: ${name}
Email: ${email}
Contact: ${contact}

Message:
${message}
      `,
    };

    // Send email
    console.log(" Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Detailed error sending email:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    let userMessage = "Failed to send email. ";

    if (error.code === "EAUTH") {
      userMessage +=
        "Authentication failed. Please check your email credentials.";
    } else if (error.code === "ECONNECTION") {
      userMessage += "Connection error. Please check your internet connection.";
    } else {
      userMessage += "Please try again later.";
    }

    return NextResponse.json(
      { success: false, message: userMessage },
      { status: 500 }
    );
  }
}

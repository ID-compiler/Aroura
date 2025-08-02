import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, contact, message, subject, isOrderConfirmation, isOrderCancellation, orderData, to } = await request.json();

    // Use 'to' field if provided (for cancellation emails), otherwise use email
    const targetEmail = to || email;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!targetEmail || !emailRegex.test(targetEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

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
    await transporter.verify();

    // Email content
    const recipientEmail = (isOrderConfirmation || isOrderCancellation) ? targetEmail : "work.ichhadwivedi@gmail.com";
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject || (isOrderCancellation ? "Order Cancellation Confirmation" : "Message from Arora"),
      // Add headers to improve deliverability
      headers: (isOrderConfirmation || isOrderCancellation) ? {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'Reply-To': process.env.EMAIL_USER,
        'X-Mailer': 'Aroura Order System'
      } : {
        'Reply-To': email, // For contact forms, reply to the sender
        'X-Mailer': 'Aroura Contact Form'
      },
      html: isOrderCancellation ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f8f9fa;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin: 0; font-size: 28px;">Aroura</h1>
            <p style="color: #666; margin: 5px 0; font-size: 16px;">Order Cancellation Confirmation</p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #dc3545;">
            <h2 style="color: #721c24; margin: 0 0 10px 0; font-size: 20px;"> Order Cancelled</h2>
            <p style="color: #721c24; margin: 0; font-size: 16px;">Your order has been successfully cancelled as requested.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #dc3545; margin-top: 0; font-size: 18px;">Cancellation Details:</h3>
            <p style="margin: 8px 0; color: #333;"><strong>Order ID:</strong> ${orderData?.orderId}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Customer Name:</strong> ${orderData?.customerName}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Cancelled At:</strong> ${orderData?.cancelledAt}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Order Total:</strong> ₹${orderData?.total}</p>
          </div>
          
          ${orderData?.orderItems ? `
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #dc3545; margin-top: 0; font-size: 18px;">Cancelled Items:</h3>
            ${orderData.orderItems.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0; margin-bottom: 10px;">
                <p style="margin: 5px 0; color: #333;"><strong>${item.product}</strong></p>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">Size: ${item.selectedSize} | Quantity: ${item.quantity} | Price: ₹${item.price}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div style="text-align: center; padding: 20px; background-color: #dc3545; border-radius: 8px; color: white;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">Refund Information</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px;">If you made a payment, the refund will be processed within 5-7 business days to your original payment method.</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">If you have any questions, please contact our support team.</p>
          </div>
        </div>
      ` : isOrderConfirmation ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f8f9fa;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4c2438; margin: 0; font-size: 28px;">Aroura</h1>
            <p style="color: #666; margin: 5px 0; font-size: 16px;">Thank you for your order!</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
            <h2 style="color: #155724; margin: 0 0 10px 0; font-size: 20px;"> Order Confirmed!</h2>
            <p style="color: #155724; margin: 0; font-size: 16px;">Your payment was successful and your order is being processed.</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #4c2438; margin-top: 0; font-size: 18px;">Customer Details:</h3>
            <p style="margin: 8px 0; color: #333;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #333;"><strong>Contact:</strong> ${contact}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #4c2438; margin-top: 0; font-size: 18px;">Order Details:</h3>
            <div style="color: #555; line-height: 1.6; font-size: 15px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #4c2438; border-radius: 8px; color: white;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">What's Next?</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px;">We'll process your order and keep you updated via email.</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">Thank you for choosing Aroura!</p>
          </div>
        </div>
      ` : `
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
      text: isOrderCancellation ? `
AROURA - Order Cancellation Confirmation

Dear ${orderData?.customerName},

Your order has been successfully cancelled as requested.

Cancellation Details:
- Order ID: ${orderData?.orderId}
- Customer Name: ${orderData?.customerName}
- Cancelled At: ${orderData?.cancelledAt}
- Order Total: ₹${orderData?.total}

${orderData?.orderItems ? `
Cancelled Items:
${orderData.orderItems.map(item => `- ${item.product} (Size: ${item.selectedSize}, Quantity: ${item.quantity}, Price: ₹${item.price})`).join('\n')}
` : ''}

REFUND INFORMATION:
If you made a payment, the refund will be processed within 5-7 business days to your original payment method.

If you have any questions, please contact our support team.

Best regards,
Aroura Team
      ` : isOrderConfirmation ? `
AROURA - Order Confirmation

Dear ${name},

Thank you for your order! Your payment was successful and your order is confirmed.

Customer Details:
- Name: ${name}
- Email: ${email}
- Contact: ${contact}

Order Details:
${message}

What's Next?
We'll process your order and keep you updated via email.

Thank you for choosing Aroura!

Best regards,
Aroura Team
      ` : `
Message from Arora

Name: ${name}
Email: ${email}
Contact: ${contact}

Message:
${message}
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);

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

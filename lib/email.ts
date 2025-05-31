import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface PurchaseEmailData {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  orderTotal: number;
  items: OrderItem[];
  paymentIntentId?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Battle Damage Studios"}" <${
        process.env.EMAIL_USER
      }>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

export const sendPurchaseConfirmationEmail = async (
  data: PurchaseEmailData
): Promise<boolean> => {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${
        item.name
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(
        2
      )}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Purchase Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Purchase Confirmation</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase!</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Hello ${data.customerName || "Customer"},
        </p>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          We've received your payment and your order is being processed. Here are the details of your purchase:
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #495057;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${
            data.orderId
          }</p>
          ${
            data.paymentIntentId
              ? `<p style="margin: 5px 0;"><strong>Payment ID:</strong> ${data.paymentIntentId}</p>`
              : ""
          }
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${data.orderTotal.toFixed(
            2
          )}</p>
        </div>
        
        <h3 style="color: #495057; margin: 30px 0 15px 0;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #dee2e6;">$${data.orderTotal.toFixed(
                2
              )}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0056b3;">What's Next?</h4>
          <p style="margin: 0; color: #0056b3;">
            You can view your purchase history and download your items by logging into your account on our website.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
          }/profile/purchases" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View My Purchases
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
          If you have any questions about your order, please don't hesitate to contact our support team.
        </p>
        
        <p style="font-size: 14px; color: #666; margin: 0;">
          Thank you for choosing Battle Damage Studios!
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          This email was sent to ${data.customerEmail}
        </p>
        <p style="margin: 5px 0 0 0;">
          © ${new Date().getFullYear()} Battle Damage Studios. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Purchase Confirmation - Battle Damage Studios
    
    Hello ${data.customerName || "Customer"},
    
    We've received your payment and your order is being processed.
    
    Order Details:
    - Order ID: ${data.orderId}
    ${data.paymentIntentId ? `- Payment ID: ${data.paymentIntentId}` : ""}
    - Total Amount: $${data.orderTotal.toFixed(2)}
    
    Items Purchased:
    ${data.items
      .map(
        (item) =>
          `- ${item.name} (Qty: ${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n")}
    
    Total: $${data.orderTotal.toFixed(2)}
    
    You can view your purchase history by visiting: ${
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }/profile/purchases
    
    Thank you for choosing Battle Damage Studios!
  `;

  return await sendEmail({
    to: data.customerEmail,
    subject: `Purchase Confirmation - Order #${data.orderId}`,
    html,
    text,
  });
};

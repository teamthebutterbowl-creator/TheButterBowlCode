import { sendEmail } from "../utils/resendEmail.js";
import {
  orderPlacedAdminTemplate,
  orderConfirmationUserTemplate,
} from "../utils/emailTemplates.js";

export const sendOrderEmails = async (order) => {
  try {
    // ADMIN EMAIL
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New Order - ${order.orderNumber}`,
      html: orderPlacedAdminTemplate(order),
    });

    // USER EMAIL (optional)
    if (order.customerDetails.email) {
      await sendEmail({
        to: order.customerDetails.email,
        subject: `✅ Order Confirmed - ${order.orderNumber}`,
        html: orderConfirmationUserTemplate(order),
      });
    }
  } catch (err) {
    console.log("Order email error:", err.message);
  }
};
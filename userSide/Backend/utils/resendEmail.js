import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.log("Resend error:", error);
    throw new Error("Email sending failed");
  }
};
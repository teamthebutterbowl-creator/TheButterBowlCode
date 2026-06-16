import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "The Butter Bowl <hello@thebutterbowl.in>",
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
import nodemailer from "nodemailer";

const sendEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ FIXED
        pass: process.env.EMAIL_PASS, // ✅ FIXED
      },
    });

    await transporter.sendMail({
      from: `"AI Chat Support" <${process.env.EMAIL_USER}>`, // ✅ GOOD PRACTICE
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>This link is valid for 15 minutes.</p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:10px 20px;background:#6366f1;color:white;border-radius:5px;text-decoration:none;">
             Reset Password
          </a>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;

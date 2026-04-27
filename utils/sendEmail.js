import nodemailer from "nodemailer";

const sendEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // important
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AI Chat" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>This link is valid for 15 minutes</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;

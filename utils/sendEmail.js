import nodemailer from "nodemailer";

const sendEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // ✅ FIX
      pass: process.env.EMAIL_PASS, // ✅ FIX
    },
  });

  await transporter.sendMail({
    from: `"AI Chat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset",
    html: `
      <h3>Reset your password</h3>
      <p>This link is valid for 15 minutes</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};

export default sendEmail;

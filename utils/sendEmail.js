import nodemailer from "nodemailer";

const sendEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
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

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSKEY, // Use the app password, not your Gmail password
  },
});

const sendMail = async() => {
  try {
    const info = await transporter.sendMail({
      from: '"UniCart" <yourgmail@gmail.com>',
      to: "sambacode2003@gmail.com",
      subject: "Order Confirmation",
      html: "<b>Thank you for your order!</b>",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

module.exports = sendMail;

const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// absolute path to root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., "mathmaster336@gmail.com"
    pass: process.env.EMAIL_PASS,
  },
});
// sendOTPEmail("mangeshgautam07@gmail.com", 1234);
async function sendOTPEmail(toEmail, otp) {
  // HTML email template with OTP injected
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        h2 {
          color: #2b6cb0;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.5;
        }
        .otp {
          display: inline-block;
          font-size: 24px;
          letter-spacing: 4px;
          background: #e6f0ff;
          padding: 12px 20px;
          color: #2b6cb0;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #a0aec0;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>MathMaster Admin - Password Reset</h2>
        <p>Hi Admin,</p>
        <p>We received a request to reset your password for your MathMaster admin account.</p>
        <p>Use the OTP below to reset your password:</p>
        <div class="otp">${otp}</div>
        <p>If you didn’t request a password reset, you can ignore this email.</p>
        <p>Thanks,<br />MathMaster Support Team</p>

        <div class="footer">
          &copy; 2025 MathMaster. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: `"MathMaster Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code for Password Reset",
    html:htmlTemplate ,
     headers: {
    "Content-Type": "text/html; charset=UTF-8"
  }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = { sendOTPEmail };

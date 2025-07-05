// ✅ If using Firebase CLI env loading (.env.mathmaster-cbffc), do NOT use dotenv
// ❌ Do NOT add this if using Firebase native env
require("dotenv").config({ path: __dirname + "/../.env.local" });

const {EMAIL_USER} = require("../Services/AppConfig");
const {EMAIL_PASS} = require("../Services/AppConfig");

const appPass = process.env.EMAIL_PASS;
console.log("Loaded email:", process.env.EMAIL_USER);


const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // ✅ Use Gmail App Password
  },
});

// sendOTPEmail("mangeshgautam07@gmail.com", 123456);

// Send OTP Email
async function sendOTPEmail(toEmail,htmlTemplate) {
  // const htmlTemplate = `
   

  const mailOptions = {
    from: `"MathMaster Admin" <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code for Password Reset",
    html: htmlTemplate,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
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

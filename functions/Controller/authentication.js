const { db } = require("../firebaseAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../Services/AppConfig");
// require("dotenv").config({ path: __dirname + "/../.env" });

const { sendOTPEmail } = require("../Activity/emailService");
const { ServiceEmaiLOTP } = require("../Services/EmailService");

const { Timestamp } = require("firebase-admin/firestore");


// const JWT_SECRET=process.env.JWT_SECRET

async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Step 2: Find admin by email
    const snapshot = await db
      .collection("mmadmins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();

    // Step 3: Compare password
    const isMatch = await bcrypt.compare(password, adminData.password);

    if (!isMatch) {
      return res.status(200).json({ error: "Invalid email or password" });
    }

    // Step 4: Create JWT token
    const token = jwt.sign(
      {
        uid: adminDoc.id,
        email: adminData.email,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Step 5: Respond with token
    return res.status(200).json({ message: "success", token });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function adminRegister(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Step 2: Check if admin already exists
    const existingAdmin = await db
      .collection("mmadmins")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingAdmin.empty) {
      return res.status(409).json({ error: "Admin already registered" });
    }

    // Step 3: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Step 4: Store admin in Firestore
    const newAdmin = {
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("mmadmins").add(newAdmin);

    // Step 5: Respond
    res.status(201).json({
      message: "Admin registered successfully",
      adminId: docRef.id,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    // 

    // 1. Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization token missing or invalid format" });
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 3. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. If valid, send back the decoded info
    return res.status(200).json({
      message: "valid",
      user: decoded, // Includes uid, email, role
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

//users Authentications

async function userLogin(req, res) { }
async function userRegister(req, res) { }
// FORGOT PASSWORD - Send OTP
async function forgetPassword(req, res) {
  try {
    const { adminEmail } = req.body;

    if (!adminEmail) {
      return res.status(400).json({ message: "Admin email is required" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    console.log(generatedOtp)

    await db.collection("forgetOTP").add({
      adminEmail,
      adminOtp: generatedOtp,
      createdAt: now,
    });

    const emailHassent = await sendOTPEmail(
      adminEmail,
      ServiceEmaiLOTP(generatedOtp)
    );

    if (emailHassent) {
      return res.status(200).json({
        message: "OTP sent to your email",
        status: true,
      });
    } else {
      return res.status(500).json({
        message: "Failed to send OTP email",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// VERIFY FORGOT OTP
async function verifyForgetOtp(req, res) {
  try {
    const { forgetOtp, adminEmail } = req.body;

    if (!forgetOtp || !adminEmail) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const snapshot = await db
      .collection("forgetOTP")
      .where("adminEmail", "==", adminEmail.trim())
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "OTP not found" });
    }

    // Sort manually by createdAt descending
    const sortedDocs = snapshot.docs.sort((a, b) =>
      b.data().createdAt.toDate() - a.data().createdAt.toDate()
    );

    const doc = sortedDocs[0];              // Get the latest OTP doc
    const data = doc.data();                // OTP data
    const docId = doc.id;                   // OTP Firestore document ID
    const docRef = db.collection("forgetOTP").doc(docId); // Reference to delete later

    const storedOtp = data.adminOtp;
    const createdAt = data.createdAt.toDate();
    const now = new Date();
    const diffMinutes = (now - createdAt) / (1000 * 60);

    console.log(`OTP age: ${diffMinutes} minutes`);

    // OTP expired
    if (diffMinutes > 5) {
      await docRef.delete();  // Delete expired OTP
      return res.status(200).json({ message: "OTP expired", status: false });
    }

    // OTP does not match
    if (forgetOtp !== storedOtp) {
      // Delete used (wrong) OTP
      return res.status(200).json({ message: "Invalid OTP", status: false });
    }

    // ✅ OTP is valid
    await docRef.delete();  // Delete after successful verification

    return res.status(200).json({
      message: "OTP verified successfully",
      status: true,
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  adminLogin,
  adminRegister,
  verifyToken,
  userLogin,
  userRegister,
  forgetPassword,
  verifyForgetOtp
};

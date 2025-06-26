const { db } = require("../firebaseAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "MathMaster336VikasDevMangesh";

async function adminLogin(req, res) {
  debugger;
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
      return res.status(401).json({ error: "Invalid email or password" });
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

    console.log(token);

    // Step 5: Respond with token
    return res
      .status(200)
      .json({ message: "Login successful", token: "hello" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function adminRegister(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

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
    console.log(hashedPassword);
    // Step 4: Store admin in Firestore
    const newAdmin = {
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    console.log(newAdmin);
    const docRef = await db.collection("mmadmins").add(newAdmin);

    // Step 5: Respond
    res.status(201).json({
      message: "Admin registered successfully",
      adminId: docRef.id,
      password: hashedPassword,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//users Authentications

async function userLogin(req, res) {}
async function userRegister(req, res) {}

module.exports = {
  adminLogin,
  adminRegister,
  userLogin,
  userRegister,
};

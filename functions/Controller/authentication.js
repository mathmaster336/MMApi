const { db } = require("../firebaseAdmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../Services/AppConfig");

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

// async function adminLogin(req, res) {
//   debugger;
//   try {
//     const { email, password } = req.body;

//     // Step 1: Validate input
//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     // Step 2: Find admin by email
//     const snapshot = await db
//       .collection("mmadmins")
//       .where("email", "==", email)
//       .limit(1)
//       .get();
//     console.log(snapshot)
//     if (snapshot.empty) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     console.log()

//     const adminDoc = await snapshot.docs[0];
//     console.log(adminDoc)
//     const adminData = adminDoc.data();
//     console.log( adminDoc +"And"+adminData )
//     // Step 3: Compare password
//     const isMatch = await bcrypt.compare(password, adminData.password);

//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Step 4: Create JWT token
//     const token = jwt.sign(
//       {
//         uid: adminDoc.id,
//         email: adminData.email,
//         role: "admin",
//       },
//       JWT_SECRET,
//       { expiresIn: "2h" }
//     );

//     // Step 5: Respond with token
//     return res.status(200).json({ message: "success", token: token });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

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
    // console.log(authHeader)
   
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

async function userLogin(req, res) {}
async function userRegister(req, res) {}

module.exports = {
  adminLogin,
  adminRegister,
  verifyToken,
  userLogin,
  userRegister,
};

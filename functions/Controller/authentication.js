const { db } = require("../firebaseAdmin");

async function adminLogin(req, res) {}

async function adminRegister(req, res) {}
async function userLogin(req, res) {}
async function userRegister(req, res) {
  const snapshot = await db.collection("messages").get();

  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  res.status(200).json({
    body: req.body,
    firestoreData: messages,
  });
}

module.exports = {
  adminLogin,
  adminRegister,
  userLogin,
  userRegister,
};

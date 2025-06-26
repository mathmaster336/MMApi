// Admin SDK Setup
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

initializeApp();

const bucket = getStorage().bucket(); // Uses default bucket

const db = getFirestore();
const storage = getStorage();

module.exports = {
  db,
  storage,
  bucket,
};

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// express and Cors
const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");
const routes = require("./Routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',routes)

setGlobalOptions({ maxInstances: 10 });

exports.addmessage = onRequest(
  { region: "asia-south2", maxInstances: 10 },
  app
);

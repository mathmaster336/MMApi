const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// express and Cors
const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");
const routes = require("./Routes/authRoutes");
const courseRoute = require("./Routes/course");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',routes)
app.use('/courses',courseRoute)

setGlobalOptions({ maxInstances: 10 });

exports.addmessage = onRequest(
  { region: "asia-south2", maxInstances: 10 },
  app
);

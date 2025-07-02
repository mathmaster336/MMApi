const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// Auth Api Functions 
const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");
const routes = require("./Routes/authRoutes");
const courseRoute = require("./Routes/course");

const authApi = express();
authApi.use(cors());
authApi.use(express.json());

authApi.use('/auth',routes)

setGlobalOptions({ maxInstances: 10 });

exports.authApi = onRequest(
  { region: "asia-south2", maxInstances: 10 },
  authApi
);


// Content Function Api 
const contentApi =express();
contentApi.use(cors());
contentApi.use(express.json());

contentApi.use('/courses',courseRoute)


exports.contentApi = onRequest(
  { region: "asia-south2", maxInstances: 10 },
  contentApi
);




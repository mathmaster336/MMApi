const express = require("express");
const {
  adminLogin,
  adminRegister,
  userLogin,
  userRegister,
} = require("../Controller/authentication");
const routes = express.Router();

routes.post("/adminlogin", adminLogin);
routes.post("/adminregister", adminRegister);
routes.post("/userlogin", userLogin);
routes.post("/userregister", userRegister);


module.exports= routes;
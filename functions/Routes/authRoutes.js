const express = require("express");
const {
  adminLogin,
  adminRegister,
  userLogin,
  userRegister,
  verifyToken,
  forgetPassword,
  verifyForgetOtp,
  adminResetPassword,
} = require("../Controller/authentication");
const routes = express.Router();

routes.post("/adminlogin", adminLogin);
routes.post("/adminregister", adminRegister);
routes.post("/admintokenverify", verifyToken);
routes.post("/userlogin", userLogin);
routes.post("/userregister", userRegister);
routes.post("/foregetpassword",forgetPassword)
routes.post("/VerifyForgetOtp",verifyForgetOtp)
routes.post("/adminResetpassword",adminResetPassword)


module.exports = routes;

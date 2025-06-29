const express = require("express");
const { getAllCoursesList } = require("../Controller/Course");

const courseRoute = express.Router();


courseRoute.post("/allcourses",getAllCoursesList)

module.exports = courseRoute;

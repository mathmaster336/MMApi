const express = require("express");
const { getAllCoursesList } = require("../Controller/Course");
const { checkAdminAuth } = require("../Middleware/CourseAdminAuth");

const courseRoute = express.Router();

courseRoute.post("/allcourses", checkAdminAuth, getAllCoursesList);

module.exports = courseRoute;

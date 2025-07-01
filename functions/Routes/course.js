const express = require("express");
const { getAllCoursesList, getAllContentofCourse } = require("../Controller/Course");
const { checkAdminAuth } = require("../Middleware/CourseAdminAuth");

const courseRoute = express.Router();

courseRoute.post("/allcourses", checkAdminAuth, getAllCoursesList);
courseRoute.post("/courseContent",getAllContentofCourse)

module.exports = courseRoute;

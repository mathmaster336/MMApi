const { db } = require("../firebaseAdmin");
const {
  getAllByParentID,
} = require("../FirebaseHelperMethod/FirebaseHelperMethod");

async function getAllCoursesList(req, res) {
  try {
    const snapshot = await db.collection("courses").get();
    // console.log(snapshot)
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(courses)
    res.status(200).json(courses); // ✅ Send courses as JSON
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ error: error.message }); // ✅ Send proper error response
  }
}
async function getAllContentofCourse(req, res) {
  const { courseID, parentID } = req.body;

  console.log(parentID + " and  " + courseID);
  if (!parentID) {
    return res.status(400).json({ error: "parentID is required" });
  }

  try {
    const result = await getAllByParentID(parentID, courseID);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting course content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllCoursesList,
  getAllContentofCourse,
};

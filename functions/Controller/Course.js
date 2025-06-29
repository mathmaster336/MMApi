const { db } = require("../firebaseAdmin");

async function getAllCoursesList(req, res) {
  try {
    const snapshot = await db.collection("courses").get();
    // console.log(snapshot)
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(courses)
    res.status(200).json(courses);  // ✅ Send courses as JSON
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ error: error.message }); // ✅ Send proper error response
  }
}

module.exports = {
  getAllCoursesList,
};

const { db } = require("../firebaseAdmin");

async function getAllByParentID(parentID, courseID) {
  const collections = ["folder", "image", "video", "pdf"];
  const result = {};

  await Promise.all(
    collections.map(async (colName) => {
      const subcollectionRef = db
        .collection("courses")
        .doc(courseID)
        .collection(colName);

      const snapshot = await subcollectionRef
        .where("parentId", "==", parentID)
        .get();

      result[colName] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    })
  );

  return result;
}

module.exports = {
  getAllByParentID,
};

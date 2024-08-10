
const router = require("express").Router();

const { body } = require("express-validator");

const { createBook, getBooks, getBook,deleteOne, deleteMany, updateBook } = require("../controllers/contributor.controller");




/** GET BOOKS AND CREATE BOOKS */
router.post("/books",
body("courseTitle")
.isString()
.isLength({
  min: 3,
  max: 100,
})
.withMessage("Course Title Required...!"),
body("courseCode")
.isString()
.isLength({
  min: 3,
  max: 100,
})
.withMessage("Course Code Required...!"),
body("courseType")
.isString()
.isLength({
  min: 3,
  max: 100,
})
.withMessage("Course Type Required...!"),
body("department")
.isString()
.isLength({
  min: 3,
  max: 100,
})
.withMessage("Department Required...!"),
body("level")
.isString()
.isLength({
  min: 3,
  max: 100,
})
.withMessage("Level Required...!"),
createBook)
router.route("/books")
.get(getBooks)
.delete(deleteMany)


/** GET, UPDATE and DELETE a Single Book */
router.route("/book/:bookId")
.get(getBook)
.put(updateBook)
.delete(deleteOne)











module.exports = router;






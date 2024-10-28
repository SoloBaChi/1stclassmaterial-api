const router = require("express").Router();

const { body } = require("express-validator");

const {
  createBook,
  getBooks,
  getBook,
  deleteMany,
  updateBook,
  deleteAll,
  deleteOne,
} = require("../controllers/contributor.controller");
const uploadBook = require("../config/multer/bookMulter");


/** GET BOOKS AND CREATE BOOKS */
router
  .route("/books")
  .post(
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

    body("level").isNumeric().withMessage("Level is Required...!"),
    uploadBook.single("docURL"),
    createBook,
  )

  .get(getBooks)
  .delete(deleteAll);

// Get, Delete Books Uploaded by a single User
router.route("/book").get(getBook).delete(deleteMany);

/** GET, UPDATE and DELETE a Single Book */
router.route("/book/:bookId").put(updateBook).delete(deleteOne);

module.exports = router;

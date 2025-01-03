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
  getAllContributedUsers,
} = require("../controllers/contributor.controller");
// const uploadBook = require("../config/multer/bookMulter");


/** GET BOOKS AND CREATE BOOKS */
router
  .route("/books")
  .post(
  body("docURL")
  .isURL()
  .withMessage("Please upload a valid document"),
  body("thumbNail")
  .isURL()
  .withMessage("Please upload a book cover"),
  body("courseCode")
    .trim()
    .matches(/^[A-Z]{3,8}\s\d{3,6}$/) // Example pattern for something like "CS101"
    .withMessage("Course code should be in the format 'ABC 123'"),

  body("courseTitle")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Course title should be between 3 and 100 characters long"),

  createBook)

  .get(getBooks)
  // .delete(deleteAll);

// Get, Delete Books Uploaded by a single User
router.route("/book")
.get(getBook)
// .delete(deleteMany)

/** GET, UPDATE and DELETE a Single Book */
router.route("/book/:bookId").put(updateBook).delete(deleteOne);


// Get all contributed users
router.get("/books/all-contributors",getAllContributedUsers);

module.exports = router;

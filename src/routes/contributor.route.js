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
// const uploadBook = require("../config/multer/bookMulter");


/** GET BOOKS AND CREATE BOOKS */
router
  .route("/books")
  .post(createBook)

  .get(getBooks)
  .delete(deleteAll);

// Get, Delete Books Uploaded by a single User
router.route("/book").get(getBook).delete(deleteMany);

/** GET, UPDATE and DELETE a Single Book */
router.route("/book/:bookId").put(updateBook).delete(deleteOne);

module.exports = router;

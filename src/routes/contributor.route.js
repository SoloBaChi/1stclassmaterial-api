
const router = require("express").Router();

const { body } = require("express-validator");

const { createBook, getBooks, getBook,deleteOne, deleteMany, updateBook } = require("../controllers/contributor.controller");




/** GET BOOKS AND CREATE BOOKS */
router.route("/books")
.post(createBook)
.get(getBooks)
.delete(deleteMany)


/** GET, UPDATE and DELETE a Single Book */
router.route("/book/:bookId")
.get(getBook)
.put(updateBook)
.delete(deleteOne)











module.exports = router;






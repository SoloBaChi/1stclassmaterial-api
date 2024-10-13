const { Router } = require("express");
const { createResult, getSingleResult, getAllResults, deleteSingleResult, updateResult, deleteAllResults, calculateCGPA } = require("../controllers/results.controller");


const router = require("express").Router();



router.route("/result")
.get(getSingleResult)
.post(createResult);




// Routes with ID
router.route("/result/:resultId")
.delete(deleteSingleResult)
.put(updateResult)


router.route("/results")
.get(getAllResults)
.delete(deleteAllResults)


// Calculate GP
router.route("/result/calculate-gp")
.get(calculateCGPA)







module.exports = router;
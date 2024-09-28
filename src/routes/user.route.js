
const router = require("express").Router();
const {
  updateUser,
  getUser,
  deleteUsers,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
// const protect = require("../middlewares/auth.middleware");
const { checkingCrypt } = require("../controllers/auth.controller");


// router.get("/my-profile", protect, me);
// router.post("/register", signUp);
// router.post("/activate/:activation_token", activateUser);
// router.post("/login", login);


///////////////////////
//**GET METHODS */
router.get("/check-token",checkingCrypt)
router.get("/my-profile", getUser);



// POST METHOD






///////////////////////
//**PUT METHODS */
router.put("/updateuser",updateUser);



router.delete("/users",deleteUsers)

module.exports = router;

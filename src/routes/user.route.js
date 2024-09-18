
const router = require("express").Router();
const {
  sendResetPassowrdToken,
  verifyResetPasswordToken,
  updateUser,
  getUser,
  signUp,
  login,
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

router.post(
  "/reset-token",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  sendResetPassowrdToken,
);


///////////////////////
//**PUT METHODS */
router.put("/updateuser",updateUser);
router.put(
  "/verify-token",
  body("password")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minSymbols: 1,
      minLowercase: 1,
    })
    .withMessage(
      `Password must be 8 characters and should include numbers,symbols and uppercase`,
    ),
  verifyResetPasswordToken,
);


router.delete("/users",deleteUsers)

module.exports = router;

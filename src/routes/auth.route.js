
const router = require("express").Router();
const {
  signUp,
  login,
  activateUser,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");


///////////////////////
//**POST METHODS */
/**REGISTER */
router.post("/register",
body("fullName")
.isString()
.isLength({
  min: 6,
  max: 100,
})
.withMessage("Full Name must be at least 3 characters"),
body("email").isEmail().withMessage("Please enter a valid email address"),
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
body("confirmPassword")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `Confirm Password must be 8 characters and should include numbers,symbols and uppercase`,
),
signUp)

/**LOGIN */
router.post("/login",
body("email").isEmail().withMessage("Please enter a valid email address"),
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
  login)


/** AcTIVATE A USER */
router.get("/activate",activateUser)

module.exports = router;

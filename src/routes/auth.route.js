
const router = require("express").Router();
const {
  signUp,
  login,
  activateUser,
  confirmResetPassword,
  verifyResetPasswordToken,
  sendResetPassowrdToken,
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

body("email")
.isEmail()
.withMessage("Please enter a valid email address"),

body("password")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `Password must be 8 characters and should include a number, symbol and an uppercase`,
),

body("confirmPassword")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `Confirm Password must be 8 characters and should include a number, symbol and an uppercase`,
),

body("phoneNumber")
.isMobilePhone()
.withMessage('Please enter a valid phone number'),

body("department")
.isString()
.isLength({
  min: 6,
  max: 100,
})
.withMessage("Please enter a valid department"),

body('level')
.isInt({ 
  min: 100, 
  max: 700 
})
.withMessage('Please choose level between 100 and 700'),

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
    `Password must be 8 characters and should include a number ,symbol and an uppercase`,
  ),

  login)


/** AcTIVATE A USER */
router.get("/activate",activateUser);



// FORGOT PASSWORD  ROUTES
router.post(
  "/reset-token",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  sendResetPassowrdToken,
);

router.put(
  "/verify-token",
  body("otp")
  .isString()
  .isLength({
    min: 4,
    max: 4,
  })
  .withMessage(
      `Please enter the correct four digit code sent to your email`,
    ),
  verifyResetPasswordToken,
);

router.put(
  "/reset-password",
  body("newPassword")
  .isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  })
  .withMessage(
    `Password must be 8 characters and should include a number,symbol and an uppercase`,
  ),
  body("confirmNewPassword")
  .isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  })
  .withMessage(
    `Password must be 8 characters and should include a number,symbol and an uppercase`,
  ),
  confirmResetPassword,
);


module.exports = router;

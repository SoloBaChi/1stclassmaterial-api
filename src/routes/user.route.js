
const router = require("express").Router();
const {
  updateUser,
  getUser,
  deleteUsers,
  deleteUser,
  updateUserPassword,
  feedBackMessage,
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
 // Feeback Route
 router.post("/feedback",
  body("message")
  .isString()
  .isLength({
    min: 10,
    max: 500,
  })
  .withMessage("Message content must be greater than ten characters"),
    feedBackMessage
  )





///////////////////////
//**PUT METHODS */
router.put("/edit-user",updateUser);
router.put("/update-password",
 body("oldPassword")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `Old Password must be 8 characters and should include numbers,symbols and uppercase`,
),
  body("newPassword")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `New Password must be 8 characters and should include numbers,symbols and uppercase`,
),
body("confirmPassword")
.isStrongPassword({
  minLength: 8,
  minUppercase: 1,
  minSymbols: 1,
  minLowercase: 1,
})
.withMessage(
  `Confirm Password must be 8 characters and should include numbers,symbols and uppercase`
),
  updateUserPassword)



router.delete("/delete-user",deleteUser)

module.exports = router;

// const url = require("url");
const validationResult = require("express-validator").validationResult,
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  nodemailer = require("nodemailer");

// const sendActivationToken = require("../services/sendActivationEmail");
const generateActivationToken = require("../utils/generateActivationToken");
const generateRandomAvatar = require("../utils/generateRandomAvatar");
const generateRandomDigit = require("../utils/generateRandomDigit");

//*** local modules */
const ResponseMessage = require("../utils/responseMessage"),
  userModel = require("../models/user.model");


const auth = {};

const newToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.AUTHENTICATION_SECRET_KEY,
  );

// Verify Jwt Token
const verifyToken = (token) =>
  jwt.verify(token, process.env.AUTHENTICATION_SECRET_KEY);

// Register a user
auth.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ResponseMessage("error", 400, errors.array()[0].msg));
  }

  try {
    const { fullName, email, password, confirmPassword, phoneNumber,department,level} = req.body;
    // check if the email exist
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Email already exist..!"));
    }

    // Check if the password matches
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Password does not match!"));
    }

    // Generate Activation Token
    const activationToken = await generateActivationToken();

    // Create a User Without Saving to the database
    const newUser = await userModel.create({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
      confirmPassword: await bcrypt.hash(confirmPassword, 10),
      phoneNumber,
      department,
      level,
      activationToken,
      profileImg:await generateRandomAvatar(email)
    });

    // Create an activation link
    const activationLink = `https://www.1stclassmaterial.com/activate-account?email=${email}&token=${activationToken}`;

    // Generate Access token
    const accessToken = await newToken(newUser);

    // Send the Activation link to the email
    const transporter = nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // or 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Activate Your Account",
      attachments: [
        {
          filename: "logo.png",
          path: `${__dirname}/logo.png`,
          cid: "save-logo.png",
        },
      ],
      html: `
      <body style="padding:0.8rem;box-sizing:border-box;padding:2rem 2%">
      <div style="display:block;text-align:center">
       <img src="cid:save-logo.png" alt="logo image"/>
      </div>
      <h3 style="font-size:1.2rem;font-weight:800">Dear 1st Classnite,</h3>
      <p style="font-size:1.2rem;line-height:1.5">
       Your account <a href="#" style="color:#00f">${email}</a> has been successfully created at<br>
      <a style="text-decoration:none;font-size:1.4rem;font-weight:600;color:#2c7e54;" href="https://www.1stclassmaterial.com">www.1stclassmaterial.com</a>
      <br>
       To activate your account, Please click on the link below
      </p>
      <button 
      style="border:none;box-shadow:none;font-size:1.1rem;display:block;width:70%;border-radius:8px;background:#2c7e54;cursor:pointer;padding:0;margin-bottom:1rem">
      <a style="text-decoration:none;color:#fff;display:block;padding:0.75rem;border-radius:inherit;" href="${activationLink}">Activate Your Account</a>
      </button>
      <small  style="font-size:0.85rem;margin-bottom:1rem;display:inline-block;">If the above link cannot be clicked, please copy it to your browser address bar to enter the access, the link is valid within 24 hours</small>
      <address style="font-size:0.98rem;font-weight:bold">
      	Best Regards,
      	<br>
      	1st Class Material Team
      </address>
      </body>
        `,
    };
    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.log(`Error sending Activation Email`, error); 
        return res.status(400).json(new ResponseMessage("error",400,`Error sending Activation Email`))
      }

      return res
        .status(200)
        .json(
          new ResponseMessage(
            "success",
            200,
            "Activation link sent to your email, Please check your inbox or spam to activate your account",
            {
            accessToken,
            }
          ),
        );
    });
    // console.log(newUser);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error"));
  }
};


//**  Activate user account
//GET http://localhost:8001/activate?email=""&token=""
auth.activateUser = async (req, res) => {
  // const {
  //   pathname,
  //   query: { email, token },
  // } = url.parse(req.url, true);
  // console.log(token);
  const { email, token } = req.query;
  try {
    const user = await userModel.findOne({
      activationToken: token,
    });
    if (!user) {
      // console.log("user does not exist");
      return res
        .status(404)
        .json(new ResponseMessage("error", 404, "Invalid Activation Token"));
    }
    // Activate the user and save to the DB
    user.isActive = true;
    user.activationToken = null; //reset the activation token to null
    await user.save();

    // Generate Access token
    const accessToken = await newToken(user);
    // send email for account comfirmation
    const transporter = nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // or 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Account Confirmation",
      attachments: [
        {
          filename: "logo.png",
          path: `${__dirname}/logo.png`,
          cid: "save-logo.png",
        },
      ],
      html: `
      <body style="padding:0.8rem;box-sizing:border-box;padding:2rem 2%">
      <div style="display:block;text-align:center">
       <img src="cid:save-logo.png" alt="logo image"/>
      </div>
      <h3 style="font-size:1.2rem;font-weight:800">Hi ${user.fullName}</h3>
      <p style="font-size:1.2rem;line-height:1.5">
       Thanks for Creating account with us 
       <br/>
       Your account has been activated Successfully!
      </p>
      <p style="font-size:1.2rem">Kindly visit <a style="text-decoration:none;color:#3a8d97;padding:0.75rem;border-radius:inherit;font-size:1.2rem" href="https://www.1stclassmaterial.com/login.html">1st Class Material </a> to continue with your dashboard</p>
      <small  style="font-size:1.2rem;margin-bottom:1rem;display:inline-block;">If you did not initiate this action , please kindly reply to this email..</small>
      <address style="font-size:0.98rem">
      	Best Regards,
      	<br>
      	1st Class Material Team
      </address>
      </body>
      `,
    };
    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.log(`Error sending comfirmation Email`, error);
        return res.status(400).json(new ResponseMessage("error",400,`Error sending comfirmation Email`))
      }

      return res.status(200).json(
        new ResponseMessage("success", 200, "You Account has been Activated Successfully.!", {
          accessToken,
        }),
      );
    });

  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error"));
  }
};

// Login a user
// POST : localhost:8000/auth/login
 auth.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ResponseMessage("error", 400, errors.array()[0].msg));
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    // Check if email does not exist
    if (!user) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Invalid Email!"));
    }

    // check if the user has been activated
    if (!user.isActive) {
      return res
        .status(400)
        .json(
          new ResponseMessage(
            "error",
            400,
            "Verification failed!\n use the link sent to your email to activate your account",
          ),
        );
    }
    //Check the if the password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Invalid Password!"));
    }

    // Genearate token
    const accessToken = await newToken(user);

    return res.status(200).json(
      new ResponseMessage("success", 200, "Login Successfully", {
        accessToken,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Sever Error"));
  }
};

// ***GET: http://localhost:8001/api/v1/user
auth.getUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, _id: id, profileImg, noOfContributions ,isActive,department,level} = req.user;
    return res.status(200).json(
      new ResponseMessage(
        "success",
        200,
        "Fetched Your Profile Successfully...!",
        {
          id,
          fullName,
          phoneNumber,
          email,
          profileImg,
          noOfContributions,
          isActive,
          department,
          level
        },
      ),
    );
  } catch (err) {
    return res
      .status(404)
      .json(new ResponseMessage("error", 404, "Internal Sever Error!"));
  }
};

// POST : localhost:8000/api/v1/upadteuser
auth.updateUser = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await userModel.findOneAndUpdate({ email }, req.body, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .json(new ResponseMessage("error", 404, "user not found..!"));

    // return updated user
    return res.status(200).json(
      new ResponseMessage("success", 200, "User updated Successfully...!", {
        user,
      }),
    );
  } catch (err) {
    return res
      .status(404)
      .json(new ResponseMessage("error", 404, "Internal Sever Error!"));
  }
};


// POST : localhost:8000/api/v1/upadte
// ////////////
///FORGOT PASSWORD
auth.sendResetPassowrdToken = async (req, res) => {
  // const {email} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ResponseMessage("error", 400, errors.array()));
  }
  try {
    // Get the user email
    const { email } = req.body;

    // Check if the user exist
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json(
          new ResponseMessage(
            "error",
            400,
            "No account associated with this email",
          ),
        );
    }

    // Generate random Digit and update the user authToken
    const authCode = generateRandomDigit();
    // console.log(authCode);
    const updatedUser = await userModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { authCode: await bcrypt.hash(authCode, 10) },
      { new: true },
    );

    //Generate an access Token
    const authToken = await newToken(updatedUser);
    console.log(updatedUser);

    //Send the Generated token to the user email
    const transporter = nodemailer.createTransport({
      host:process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // or 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Reset Password Token",
      html: `
      <body style="padding:0.8rem">
      <h1 style="font-family:sans-serif;font-weight:600;font-size:1.8rem">You Requested for forgot Password</h1>
     <p style="font-size:1.2rem;line-height:1.5">
      Use the token below to reset your password <br>
      </p>
      <button 
      style="border:none;box-shadow:none;display:block;width:100%;border-radius:8px;background:#ef5533;cursor:pointer;padding:0">
      <a style="text-decoration:none;color:#fff;border:1px solid red;display:block;padding:0.75rem;border-radius:inherit;font-weight:700;font-family:sans-serif;font-size:2rem;letter-spacing:5px">${authCode}</a></button>
      </body>
      `,
    };
    transporter.sendMail(mailOptions, (error, success) => {
      if (error) {
        console.log(`Error sending comfirmation Email`, error);
      }

      return res.status(200).json(
        new ResponseMessage("success", 200, "OTP sent to your email", {
          authToken,
        }),
      );
    });
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal server error"));
  }
};

// verify Reset password Token
auth.verifyResetPasswordToken = async (req, res) => {
  // Get the password to be updated
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ResponseMessage("error", 400, errors.array()));
  }
  try {
    const { authToken, otp, password } = req.body;

    // Decode the auth token using jwt and check for validity
    let decodedToken;
    try {
      decodedToken = await verifyToken(authToken);
    } catch (err) {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "unverified token"));
    }
    if (!decodedToken) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "invalid token"));
    }

    // Get the user id using the decoded token
    const userId = decodedToken.id;
    if (!userId) {
      return res
        .status(400)
        .json(
          new ResponseMessage(
            "error",
            400,
            `user with ${userId} does not exist`,
          ),
        );
    }

    // Find the user using the user id
    const user = await userModel.findOne({ _id: userId });
    // console.log(user);

    // Check if the OTP is null i.e (has been used)
    if (!user.authCode) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "OTP has been used"));
    }

    // Compare the hashed token
    isCorrectOtp = await bcrypt.compare(otp, user.authCode);
    if (!isCorrectOtp) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "invalid OTP !"));
    }
    // update the user password
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      { password: await bcrypt.hash(password, 10) },
      { new: true },
    );

    // Reset the authCode to null and Save it
    user.authCode = null;
    await user.save();

    return res.status(200).json(
      new ResponseMessage("error", 200, "password updated successfully", {
        updatedUser,
      }),
    );
  } catch (err) {
    // return res;
    console
      .log(err)
      .status(400)
      .json(new ResponseMessage("error", 400, "Internal Server Error"));
  }
};





//DELETE: localhost:8000/api/v1/users
auth.deleteUsers =  async(req,res) => {
try{
const deletedUsers = await userModel.deleteMany({});
return res.status(204).json(new ResponseMessage("success",204,"Done deleting all users"))
}
catch(err){
return res.status(400).json(new ResponseMessage("error",400,"Error deleting Users..!"))
}
}








auth.checkingCrypt =  async(req,res) => {
  const token = generateActivationToken();
  console.log(token)
  return res.status(200).json({
    message:"success",
    token:token
  })
}

module.exports = auth;

// const url = require("url");
const validationResult = require("express-validator").validationResult,
  jwt = require("jsonwebtoken"),
  nodemailer = require("nodemailer");

const userModel = require("../models/user.model");
//*** local modules */
const ResponseMessage = require("../utils/responseMessage"),
  contributorModel = require("../models/contributor.model");

const contributorController = {};

const newToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.AUTHENTICATION_SECRET_KEY,
  );

// Verify Jwt Token
const verifyToken = (token) =>
  jwt.verify(token, process.env.AUTHENTICATION_SECRET_KEY);

/**Upload a Book */
//POST http://localhost:8001/api/v1/contributor/books
contributorController.createBook = async (req, res) => {
  try {
    const { email, _id: userId } = req.user;

    const {
      courseTitle,
      courseType,
      courseCode,
      department,
      level,
      docURL,
      thumbNail,
    } = req.body;

    // check if the email exist
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json(
          new ResponseMessage(
            "error",
            400,
            "You do not have an account with us..!",
          ),
        );
    }

    const newBook = await contributorModel.create({
      courseTitle,
      courseType,
      courseCode,
      department,
      level,
      docURL,
      thumbNail,
      contributor: userId,
    });

    // update the existing user
    user.noOfContributions = (user.noOfContributions || 0) + 1;
    await user.save();

    // Send notification email
    const transporter = nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT, // or 587 for TLS
      // secure: true, // true for 465, false for 587
      // auth: {
      //   user: process.env.EMAIL_FROM,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
      service: "gmail",
      auth: {
      user: process.env.GOOGLE_GMAIL,
      pass: process.env.GOOGLE_GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_GMAIL,
      to: email,
      subject: "Books Uploaded Successfully",
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
      <h3 style="font-size:1.2rem;font-weight:800;text-transform:capitalize">Hi ${user.fullName}</h3>
      <p style="font-size:1.2rem;">
       Thanks for Uploading <em><strong> ${courseTitle} </strong> material  </em>with us 
      </p>
      <p style="font-size:1.2rem;line-height:1.5">
       We really appreciate Your contribution! 
      </p>
      <small  style="font-size:1rem;margin-bottom:1rem;display:inline-block;">If you did not initiate this action , please kindly reply to this email..</small>
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
        console.log(`Error sending Email`, error);
      }

      return res.status(200).json(
        new ResponseMessage("success", 200, "Book Created sucessfully", {
          newBook,
        }),
      );
    });
    // console.log(newUser);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        new ResponseMessage("error", 500, `Internal Server Error : ${err}`),
      );
  }
};

/**Get all Uploaded Books */
//GET http://localhost:8001/api/v1/books
contributorController.getBooks = async (req, res) => {
  const books = await contributorModel.find({});
  return res.status(200).json(
    new ResponseMessage("success", 200,`Fetched Books Successfully..!`, {
      totalBooks: books.length,
      books,
    }),
  );
};

/*Get Books uploaded by a single user */
//GET http://localhost:8001/api/v1/book
contributorController.getBook = async (req, res) => {
  // const { bookId } =  req.params;
  const { _id: userId } = req.user;
  try {
    // const { id } = req.user;
    const books = await contributorModel.find({ contributor: userId });
    if (!books) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "No uploaded Book(s) found"));
    }

    return res.status(200).json(
      new ResponseMessage("success", 200, "Book Successfully Fetched!", {
        totalBooks:books.length,
        books,
      }),
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!"));
  }
};

/**update a Single Book */
//PUT http://localhost:8001/api/v1/books
contributorController.updateBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    // const { id } = req.user;
    const book = await contributorModel.findOneAndUpdate(
      { contributor: bookId },
      req.body,
      { new: true },
    );
    if (!book) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Book does not exist!"));
    }

    return res.status(200).json(
      new ResponseMessage("success", 200, "Book Successfully Updated!", {
        data: book,
      }),
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!"));
  }
};

/**delete all Uploaded Books */
//DELETE http://localhost:8001/api/v1/books
contributorController.deleteAll = async (req, res) => {
  const deletedBooks = await contributorModel.deleteMany({});

  if (!deletedBooks) {
    return res
      .status(404)
      .json(
        new ResponseMessage(
          "error",
          404,
          "No avaailable Books for deletion...!",
        ),
      );
  }

  return res.status(204).json(
    new ResponseMessage("success", 204, "Successfully Deleted all Books", {
      data: null,
    }),
  );
};

/**delete books by a  uset */
//DELETE http://localhost:8001/api/v1/book
contributorController.deleteMany = async (req, res) => {
  // const {bookId} =  req.params;
  const { _id: userId } = req.user;
  try {
    // const { id } = req.user;
    const user = await userModel.findOne({ _id: userId });
    const book = await contributorModel.deleteMany({ contributor: userId });
    if (!book) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Book does not exist!"));
    }

    user.noOfContributions = 0;
    await user.save();

    return res.status(204).json(
      new ResponseMessage("success", 204, "Book Successfully deleted!", {
        data: null,
      }),
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!"));
  }
};

// Delete a Single Book
contributorController.deleteOne = async (req, res) => {
  const { bookId } = req.params;
  try {
    // const { id } = req.user;
    const book = await contributorModel.findOneAndDelete({ _id: bookId });
    if (!book) {
      return res
        .status(400)
        .json(new ResponseMessage("error", 400, "Book does not exist!"));
    }

    user.noOfContributions = (user.noOfContributions - 1);
    await user.save();

    return res.status(204).json(
      new ResponseMessage("success", 204, "Book Successfully deleted!", {
        data: null,
      }),
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!"));
  }
};


// Get users that have contribuited
contributorController.getAllContributedUsers = async (req, res) => {
  try {
    const contributors = await contributorModel.find({});
    
    // Use a Set to collect unique contributor IDs
    const uniqueUserIds = [...new Set(contributors.map(contributor => contributor.contributor.toString()))];
    
    // Fetch all unique users based on the collected IDs
    const getContributedUsers = await Promise.all(
      uniqueUserIds.map(id => userModel.findById(id))
    );
    
    return res.status(200).json(new ResponseMessage("success", 200, "Fetched all contributed users", {
      getContributedUsers
    }));
  } catch (err) {
    return res.status(400).json(new ResponseMessage("error", 400, "Error fetching Contributors"));
  }
};



module.exports = contributorController;

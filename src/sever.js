const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const contributorRouter =  require("./routes/contributor.route");
const resultRouter =  require("./routes/result.route")
const { connectToDb } = require("./services/db.connection");
const protect = require("./middlewares/auth.middleware");

require("dotenv").config();



const app = express();

// Static Files Middleware
app.use('/materials', express.static(path.join(__dirname, 'uploads', 'contributions')));
// const staticPath = path.join(__dirname, "public", 'uploads', 'contributions');
// console.log("Serving files from: ", staticPath); // Debugging output
app.use(cors({ origin: "*" }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.disable("x-powered-by"); //less hacker know about our stack




// ROUTES
/**Default Route */
app.get("/",(req,res) => {
  return res.status(200).json({
    message:`Welcome to ${process.env.APPNAME}`,
    statusCode:200,
    status:"success",
  })
})

/** OTHER ROUTES */
// ADMIN

/**Auth Route */
app.use('/auth/',authRouter);

// middleware Route
app.use('/api',protect);

/**User Route */
app.use("/api/v1/user",userRouter);
app.use("/api/v1/user/data",resultRouter);
app.use("/api/v1/contributor",contributorRouter);




/**Not found Route */
app.use("*",(req,res) => {
  return res.status(400).json({
    message: `Page Not Found`,
    statusCode: 400,
    status: "error",
  });
})

// CREATE A PORT
const port = process.env.PORT || 4000;

// listen to the server
const start =  async() => {
  // connect to database
  await connectToDb();
  app.listen(port,() => {
      console.log(`Sever started at localhost:${port}`);
    })
};

module.exports = start;

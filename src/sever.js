const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();



const app = express();

app.use(cors({ origin: "*" }));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan("tiny"));
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
const start = () => {
  app.listen(
    (port,
    () => {
      console.log(`Sever started at localhost:${port}`);
    }),
  );
};

module.exports = start;

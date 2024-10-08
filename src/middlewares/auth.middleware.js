const jwt = require("jsonwebtoken");

const ResponseMessage = require("../utils/responseMessage");
const userModel = require("../models/user.model");

// verify jwt Token
// const expiresIn = 2
const verifyToken = (token) =>
  jwt.verify(token, process.env.AUTHENTICATION_SECRET_KEY);

const protect = async (req, res, next) => {
  try{
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "Don't have an account"));
    }
  
    //Get the token
    const token = await bearer.split(" ")[1];
    if (token === "undefined") {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "Token does not Exist!"));
    }
  
    //Decode the Token
    let decodedToken;
    try {
      decodedToken = await verifyToken(token);
    } catch (err) {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "unauthorized token"));
    }
    // Invalid Token
    if (!decodedToken) {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "Something Went wrong!"));
    }
  
    //Extract the user from the decoded token
    const { id: userId } = decodedToken;
    if (!userId) {
      return res
        .status(401)
        .json(new ResponseMessage("error", 401, "Invalid token"));
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json(new ResponseMessage("error",404,"Account does not Exist..!"));
    }
  
    req.user = user;
    // pass to the next middleware
    next();
  }
  catch(err){
   res.status(500).json(new ResponseMessage("error",500,"OOps Unauthorized Request..!"))
  }
};

module.exports = protect;

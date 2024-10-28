

const multer = require("multer");


// SET UP MULTER STORAGE
const storage  = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null, "uploads/profiles/")
    },
    filename: function(req,file,cb){
     cb(null, `${Date.now()}-${file.originalname}`); 
    }
  })


  const uploadProfile = multer({storage});

  module.exports = uploadProfile;
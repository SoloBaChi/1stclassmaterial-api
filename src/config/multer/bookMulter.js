

const multer = require("multer");


// SET UP MULTER STORAGE
const storage  = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null, "./uploads/contributions")
    },
    filename: function(req,file,cb){
     cb(null, `${Date.now()}-${file.originalname}`); 
    }
  })


  const uploadBook = multer({storage});

  module.exports = uploadBook;
const ResponseMessage = require("../utils/responseMessage");
const resultsModel = require("../models/result.model");
const userModel = require("../models/user.model");
const calculateGpResults = require("../utils/calculateGpResult");

// Calculate CGPA
const calculateCGPA = async (req, res) => {
  try {
    const { _id: userId } = req.user;

     const user = await userModel.findOne({_id:userId});
    //  if(!user){
    //  return res.status(404).josn(new ResponseMessage("error",404,"user not found..!"))
    //  }
    const userResults = await resultsModel.find({ createdBy: userId });
    const records = userResults.map((result) => [
      result.grade,
      result.unitLoad,
    ]);
    //  console.log(records)
    //  const gradepointSystem =  userResults.map(user => (user.gradePoint * user.gradePoint));
    const gradepointSystem =
      userResults
        .map((user) => user.gradePoint)
        .reduce((acc, val) => acc + val, 0) / userResults.length;
         // console.log(gradepointSystem);
       const cgpa = await calculateGpResults(records, gradepointSystem);

      //  Reduce the user cgpa point
       user.cgpaPoints -= 1;
       await user.save();
       
       return res.status(200).json(
      new ResponseMessage("success", 200, `Done calculating CGPA..!`, {
        cgpa,
      }),
    );
  } catch (err) {
    return res
      .status(400)
      .json(
        new ResponseMessage(
          "error",
          400,
          `${err.message || `Error Calculating CGPA`}`,
        ),
      );
  }
};

// GET : localhost:8000/api/v1
// Get a Result by a single user
const getSingleResult = async (req, res) => {
  try {
    const { email, _id: userId } = req.user;
    const results = await resultsModel.find({ createdBy: userId });
    if (!results) {
      return res.status(400).json(
        new ResponseMessage(
          "error",
          400,
          `No result found for this account.!`,
          {
            data: results,
          },
        ),
      );
    }

    return res.status(200).json(
      new ResponseMessage(`success`, 200, `fetched results successfully`, {
        count: results.length,
        results,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, `Internal Server Error.!`));
  }
};

// GET : localhost:8000/api/v1
// Get all Results
const getAllResults = async (req, res) => {
  try {
    // const { email,_id:userId} = req.user;
    const results = await resultsModel.find({});
    if (!results) {
      return res
        .status(404)
        .json(new ResponseMessage("error", 404, `No result found.!`));
    }

    return res.status(200).json(
      new ResponseMessage(`success`, 200, `fetched results successfully`, {
        count: results.length,
        results,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, `Internal Server Error.!`));
  }
};

// POST : localhost:8000/api/v1
// Create a Result
const createResult = async (req, res) => {
  const { courseCode, courseTitle, unitLoad, grade, gradePoint, semester } =
    req.body;
  try {
    const { _id: userId } = req.user;
    const user = userModel.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json(new ResponseMessage("error", 404, `user not found.!`));
    }
    const newResult = await resultsModel.create({
      createdBy: userId,
      courseCode,
      courseTitle,
      unitLoad,
      grade,
      gradePoint,
      semester,
    });

    return res.status(200).json(
      new ResponseMessage("success", 200, `Result data successfully added`, {
        newResult,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!"));
  }
};

// PUT : localhost:8000/api/v1/user/data/result
// Update a single Result
const updateResult = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { resultId } = req.params;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res
        .status(404)
        .json(new ResponseMessage("error", 404, `user not found..!`));
    }

    const result = await resultsModel.findByIdAndUpdate(resultId, req.body, {
      new: true,
    });

    //  console.log(result)
    if (!result) {
      return res
        .status(404)
        .json(
          new ResponseMessage(
            "error",
            404,
            `No result found with the given Id`,
          ),
        );
    }

    return res.status(200).json(
      new ResponseMessage("success", 200, `done saving data`, {
        result,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, "Internal Server Error..!", err));
  }
};

// DELETE : localhost:8000/api/v1
// Delete Results by a user
const deleteSingleResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const deletedResult = await resultsModel.findByIdAndDelete(resultId);
    if (!deletedResult) {
      return res
        .status(400)
        .json(
          new ResponseMessage("error", 400, `No result found for deletion..!`),
        );
    }
    return res.status(204).json(
      new ResponseMessage("success", 204, `successfully deleted result`, {
        data: null,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, `Internal Server`));
  }
};

// DELETE : localhost:8000/api/v1
// Delete all Results
const deleteAllResults = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const deletedResults = await resultsModel.deleteMany({ createdBy: userId });
    if (!deletedResults) {
      return res
        .status(400)
        .json(
          new ResponseMessage("error", 400, `deleted all results Successfully`),
        );
    }
    return res.status(204).json(
      new ResponseMessage("success", 204, `Successfully Deleted all Results`, {
        data: null,
      }),
    );
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseMessage("error", 500, `Internal Server`));
  }
};

module.exports = {
  createResult,
  getSingleResult,
  getAllResults,
  updateResult,
  deleteSingleResult,
  deleteAllResults,
  calculateCGPA,
};

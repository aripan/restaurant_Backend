const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // two parameters: error and file directory
    cb(null, "public/images");
  },

  filename: (req, file, cb) => {
    // two parameters: error and file extension
    cb(null, file.originalname);
  },

  path: (req, file, cb) => {
    // two parameters: error and file extension
    cb(null, req.file.path.replace(/\\/g, "/"));
  },
});

// Specifies that which kind of files(images) will be uploaded
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(JPG|jpg|JPEG|jpeg|PNG|png|GIF|gif)$/)) {
    // Here specified the call back function of fileName
    return cb(new Error("You can upload only image files!"), false);
  } else {
    return cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(express.json());

uploadRouter
  .route("/")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /imageUpload");
  })
  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /imageUpload");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("DELETE operation not supported on /imageUpload");
    }
  );

module.exports = uploadRouter;

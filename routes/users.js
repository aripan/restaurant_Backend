const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.use(express.json());

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

//! SIGNUP
router.post("/signup", (req, res, next) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user != null) {
        let err = new Error(`User ${req.body.username} already exist!`);
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then(
      (user) => {
        res.status(200).json({ status: "Registration Successful", user: user });
      },
      (err) => {
        next(err);
      }
    )
    .catch((err) => {
      next(err);
    });
});

//! LOGIN
router.post("/login", (req, res, next) => {
  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    // Checking the authorization of the user
    if (!authHeader) {
      let err = new Error("Sorry, but you are not authenticated!");

      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    } else {
      // authHeader exists, so now we will split it
      let auth = new Buffer.from(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");

      // Assigning the username and password
      let username = auth[0];
      let password = auth[1];

      User.findOne({ username: username })
        .then((user) => {
          // Checking if the user exist or not
          if (user == null) {
            let err = new Error(`User ${username} does not exist!`);
            err.status = 403;
            return next(err);
          } else if (user.username !== username || user.password !== password) {
            let err = new Error(
              `Either your username or your password is invalid!!! `
            );
            err.status = 403;
            return next(err);
          }
          // Checking the username & password
          else if (user.username == username && user.password == password) {
            // Setting up the session
            req.session.user = "authenticated";
            res.status(200).json({ status: "Login Successful" });

            // Moving forward
            next();
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  } else {
    res.status(200).json("You are already authenticated to login");
  }
});

//! LOGOUT
router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    let err = new Error("You are not logged in");
    err.status = 403;
    return next(err);
  }
});
module.exports = router;

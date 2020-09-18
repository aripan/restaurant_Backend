const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");
const authenticate = require("../authenticate");

router.use(express.json());

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

//! SIGNUP
router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        // Here i am checking that, if firstname exists,
        // then setting the user's firstname as req.body.firstname
        if (req.body.firstName) {
          user.firstName = req.body.firstName;
        }

        // Here i am checking that, if lastname exists,
        // then setting the user's lastname as req.body.lastname
        if (req.body.lastName) {
          user.lastName = req.body.lastName;
        }

        user.save((err, user) => {
          if (err) {
            res.status(500).json({ err: err });
            return;
          } else {
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          }
        });
      }
    }
  );
});

//! LOGIN
router.post("/login", passport.authenticate("local"), (req, res) => {
  let token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
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

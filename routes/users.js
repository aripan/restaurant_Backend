const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");
const authenticate = require("../authenticate");
const cors = require("./cors");
router.use(express.json());

/* GET users listing. */
router.options("*", cors.corsWithOptions, (req, res) => res.sendStatus(200));
router.get(
  "/",
  cors.corsWithOptions,
  authenticate.verifyAdmin,
  (req, res, next) => {
    User.find({ users: req.body.users })
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);

//! SIGNUP
router.post("/signup", cors.corsWithOptions, (req, res, next) => {
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
              // THIS ONE IS NEEDED FOR SOMEONE WHO HAS JUST REGISTERED.
              // I DON'T WANT TO TELL THEM THAT YOU HAVE TO LOGIN AGAIN TO GET THE ACCESS
              let token = authenticate.getToken({ _id: req.user._id });
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: true,
                status: "Registration Successful!",
                token: token,
              });
            });
          }
        });
      }
    }
  );
});

//! LOGIN
router.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }

    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      let token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "You are successfully logged in!",
        token: token,
      });
    });
  })(req, res, next);
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

//! Facebook token to authenticate the user
router.get(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    if (req.user) {
      let token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  }
);

router.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

module.exports = router;

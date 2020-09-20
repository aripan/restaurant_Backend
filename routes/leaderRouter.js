const express = require("express");
const mongoose = require("mongoose");
const leaderRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

const Leaders = require("../models/leaders");

leaderRouter.use(express.json());

leaderRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.find(req.query).then(
      (leaders) => {
        res.status(200).json(leaders);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.create(req.body).then(
        (leader) => {
          console.log("Leader Created", leader);
          res.status(200).json(leader);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.status(403).send("PUT operation is not supported on /leaders");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.remove({}).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

leaderRouter
  .route("/:leaderId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId).then(
      (promotion) => {
        res.status(200).json(promotion);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res
        .status(403)
        .send(
          "POST operation is not supported on /leaders/" + req.params.leaderId
        );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
        { $set: req.body },
        { new: true }
      ).then(
        (leader) => {
          res.status(200).json(leader);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leaderId).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

module.exports = leaderRouter;

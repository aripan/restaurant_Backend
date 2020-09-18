const express = require("express");
const mongoose = require("mongoose");
const promoRouter = express.Router();
const authenticate = require("../authenticate");
const Promotions = require("../models/promotions");

promoRouter.use(express.json());

promoRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({}).then(
      (promotions) => {
        res.status(200).json(promotions);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body).then(
      (promotion) => {
        console.log("Promotion Created", promotion);
        res.status(200).json(promotion);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.status(403).send("PUT operation is not supported on /promotions");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({}).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId).then(
      (promotion) => {
        res.status(200).json(promotion);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res
      .status(403)
      .send(
        "POST operation is not supported on /promotions/" + req.params.promoId
      );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      { $set: req.body },
      { new: true }
    ).then(
      (promotion) => {
        res.status(200).json(promotion);
      },
      (err) => next(err).catch((err) => next(err))
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndRemove(req.params.promoId).then(
        (resp) => {
          res.status(200).json(resp);
        },
        (err) => next(err).catch((err) => next(err))
      );
    }
  );

module.exports = promoRouter;

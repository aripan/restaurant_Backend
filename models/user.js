const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  //! Skipping because these two will be added automatically by passport-local-mongoose
  //   username: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },

  //   password: {
  //     type: String,
  //     required: true,
  //   },

  admin: {
    type: Boolean,
    default: false,
  },
});

// To automatically add username & password
User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);

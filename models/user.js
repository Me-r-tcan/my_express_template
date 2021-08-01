const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 510,
    },
    isAdmin: Boolean,
  },
  { timestamps: true }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isKitchen: this.isKitchen,
      isAdmin: this.isAdmin,
      isApproved: this.isApproved,
      username: this.username,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(3).max(510).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.userValidate = validateUser;

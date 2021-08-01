const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { User, userValidate, validateUserUpdate } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = userValidate(req.body);
  if (error)
    return res.status(400).send({ errorMessage: error.details[0].message });

  let username = await User.findOne({ username: req.body.username });
  if (username)
    return res.status(400).send({
      errorMessage: "Bu kullanıcı adı alınmış. Başka bir tane deneyin.",
    });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send({ errorMessage: "Bu mail adresi kullanımda." });

  user = new User(_.pick(req.body, ["username", "email", "password", "name"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email", "name"]));
});

router.put("/", auth, async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error)
    return res.status(400).send({ errorMessage: error.details[0].message });

  await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).then((user) => res.send(user));
});

module.exports = router;

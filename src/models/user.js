const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const userIcons = ["alien", "crab", "mask", "chilli", "island", "butterfly"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      match: emailRegex,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    userColor: {
      type: String,
      require: true,
      match: colorRegex,
    },
    userIcon: {
      type: String,
      require: true,
      enum: userIcons,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

// -------------JOI--------------------- //

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  userColor: Joi.string().pattern(colorRegex).required(),
  userIcon: Joi.string()
    .valid(...userIcons)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

const colorSchema = Joi.object({
  userColor: Joi.string().pattern(colorRegex).required(),
});

const iconSchema = Joi.object({
  userIcon: Joi.string()
    .valid(...userIcons)
    .required(),
});

const userSchemas = {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  colorSchema,
  iconSchema,
};

module.exports = {
  User,
  userSchemas,
};

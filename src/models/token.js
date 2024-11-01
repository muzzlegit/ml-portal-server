const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  refreshToken: { type: String, required: true },
});

tokenSchema.post("save", handleMongooseError);

const Token = model("token", tokenSchema);

const tokenSchemas = { tokenSchema };

module.exports = {
  Token,
  tokenSchemas,
};

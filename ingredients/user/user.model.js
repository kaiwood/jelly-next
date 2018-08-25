const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    token: { type: String },
    lastPostAt: Date
  },
  {
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        delete ret._id;
      }
    }
  }
);

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);

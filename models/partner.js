const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      // featured field
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
  }
);

// we create a model using a schema
const Partner = mongoose.model("Partner ", partnerSchema);

module.exports = Partner;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productAddonsSchema = new Schema(
    {
        addon_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        price: {
            type: Number,
            required: false,
            default: 0
        },
        sort_order: {
            type: Number,
            required: false,
            default: 0
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productAddonsSchema.plugin(softDelete);
  
  const ProductAddons = mongoose.model("product_addons", productAddonsSchema);
  
  module.exports = ProductAddons;
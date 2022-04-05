const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productVariantsSchema = new Schema(
    {
        variant_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        comment: {
            type:String,
            default: "",
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
  
  productVariantsSchema.plugin(softDelete);
  
  const ProductVariants = mongoose.model("product_variants", productVariantsSchema);
  
  module.exports = ProductVariants;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productVariantGroupsSchema = new Schema(
    {
        variant_group_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        product_variants: [
            {
              type: Schema.Types.ObjectId,
              ref: "product_variants",
            } 
        ],
        sort_order: {
            type: Number,
            required: false,
            default: 0
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productVariantGroupsSchema.plugin(softDelete);
  
  const ProductVariantGroups = mongoose.model("product_variant_groups", productVariantGroupsSchema);
  
  module.exports = ProductVariantGroups;
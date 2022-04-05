const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productItemGroupsSchema = new Schema(
    {
        item_group_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        products: [
            {
              type: Schema.Types.ObjectId,
              ref: "products",
            } 
        ],
        product_variants: [{
           "product_id" :{ type:Schema.Types.ObjectId ,ref: "products"},
           "variant_id" :{ type:Schema.Types.ObjectId ,ref: "product_variants"}
        }],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productItemGroupsSchema.plugin(softDelete);
  
  const ProductItemGroups = mongoose.model("product_item_groups", productItemGroupsSchema);
  
  module.exports = ProductItemGroups;
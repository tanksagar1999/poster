const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productsSchema = new Schema(
    {
        product_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
        },
        product_category: {
            type: Schema.Types.ObjectId,
            ref: "product_category",
        },
        tax_group: {
            type: Schema.Types.ObjectId,
            ref: "tax_groups",
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
        option_status:{
            type: String,
            enum: ["regular", "combo"],
            required: false
        },
        option_variant_group: [
            {
              type: Schema.Types.ObjectId,
              ref: "product_variant_groups",
            } 
        ],
        option_addon_group: [
            {
              type: Schema.Types.ObjectId,
              ref: "product_addon_groups",
            } 
        ],
        option_item_group: [
            {
              type: Schema.Types.ObjectId,
              ref: "product_item_groups",
            } 
        ],
        unit_of_measure : {
            type: String,
            required: false
        },
        product_code : {
            type: String,
            required: false
        },
        notes : {
            type: String,
            required: false
        },
        limit_to_register : [
            {
              type: Schema.Types.ObjectId,
              ref: "registers",
            } 
        ],
        additional_short_order : {
            type: Number,
            required: false
        }

    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productsSchema.plugin(softDelete);
  
  const Products = mongoose.model("products", productsSchema);
  
  module.exports = Products;
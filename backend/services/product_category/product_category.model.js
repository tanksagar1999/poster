const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productCategorySchema = new Schema(
    {
        category_name: {
            type:String,
            required:true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        order_ticket_group: {
            type: Schema.Types.ObjectId,
            ref: "order_ticket_groups",
            required: false
        },
        sort_order: {
            type: Number,
            required: false,
            default: 0
        },
        color: {
            type:String,
            required:false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productCategorySchema.plugin(softDelete);
  
  const ProductCategory = mongoose.model("product_category", productCategorySchema);
  
  module.exports = ProductCategory; 
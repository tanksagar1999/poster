const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productPriceBooksSchema = new Schema(
    {
        price_book_name: {
            type: String,
            required: true
        },
        register_id: {
              type: Schema.Types.ObjectId,
              ref: "registers",
        },
        register_assigned_to: {
            type: Schema.Types.ObjectId,
            ref: "registers",
        },
        order_type: {
            type: String,
            enum: ["all_orders", "take_away", "delivery",  "dive_in"],
            required:false,
        },
        products:{
            type:Array
        },
        variants:{
            type:Array
        },
        addons:{
            type:Array
        }
        
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productPriceBooksSchema.plugin(softDelete);
  
  const ProductPriceBooks = mongoose.model("product_price_books", productPriceBooksSchema);
  
  module.exports = ProductPriceBooks;
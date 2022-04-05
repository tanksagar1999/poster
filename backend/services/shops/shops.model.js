const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const shopsSchema = new Schema(
    {  
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: false
        },
        shop_logo: {
            type: String,
            default: "",
            required: false
        },
        shop_name: {
            type: String,
            required: false
        },
        business_type: {
            type: String,
            enum: ["food_and_drink", "home_and_lifestyle", "fashion_boutique", "small_retail","saloon_and_spa"],
            default: "food_and_drink",
            required:false,
        },
        city: {
            type: String,
            default: "",
            required: false
        },
        shop_owner_pin: {
            type: String,
            default: "",
            required: false
        },
        website_link: {
            type: String,
            default: "",
            required: false
        },
        facebook_link: {
            type: String,
            default: "",
            required: false
        },
        instagram_link: {
            type: String,
            default: "",
            required: false
        },
        user_name: {
            type: String,
            default: "",
            required: false
        },
        user_email: {
            type: String,
            default: "",
            required: false
        },
        user_mobile_number: {
            type: Number,
            default: 0,
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  shopsSchema.plugin(softDelete);
  
  const Shops = mongoose.model("shops", shopsSchema);
  
  module.exports = Shops;
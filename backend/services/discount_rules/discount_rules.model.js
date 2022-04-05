const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const discountRulesSchema = new Schema(
    {  
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        coupon_code: {
            type: String,
            default: "",
            required:true,
        },
        discount_type: {
            type:  String,
            enum: ["fixed_amount", "percentage","buy_x_get_y"],
            required: true
        },
        level: {
            type:  String,
            enum: ["order", "product"],
            required: true
        },
        registers:  [
            {
              type: Schema.Types.ObjectId,
              ref: "registers",
            } 
        ],
        start_date: {
            type:  Date,
            required: false
        },
        end_date: {
            type:  Date,
            required: false
        },
        happy_hours_time: {
            type:  String,
            required: false
        },
        days_of_week: [
            {
                type:  String,
                enum: ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            }
        ],
        apply_automatically: {
            type:  Boolean,
            default : true,
            required: false
        },
        status:{
            type:  String,
            enum: ["enable", "disable"],
            default:"enable"
        },
        discount:{
            type:  Number,
            required: false
        },
        minimum_order:{
            type:  Number,
            required: false,
            default:""
        },
        buy_quantity : {
            type:  Number,
            required: false,
        },
        buy_products : [
            {
              type: Schema.Types.ObjectId,
              ref: "products",
            } 
        ],
        buy_categories : [
            {
              type: Schema.Types.ObjectId,
              ref: "product_category",
            } 
        ],
        get_quantity : {
            type:  Number,
            required: false,
        },
        get_products : [
            {
              type: Schema.Types.ObjectId,
              ref: "products",
            } 
        ],
        get_categories : [
            {
              type: Schema.Types.ObjectId,
              ref: "product_category",
            } 
        ],
        apply_discount_only_once_per_order: {
            type:  Boolean,
            default : true,
            required: false
        },
        
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  discountRulesSchema.plugin(softDelete);
  
  const discountRules = mongoose.model("discount_rules", discountRulesSchema);
  
  module.exports = discountRules;
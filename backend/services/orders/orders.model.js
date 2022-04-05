const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const ordersSchema = new Schema(
    {
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        customer_id : {
            type: Schema.Types.ObjectId,
            ref: "customers",
            required: false
        },
        type: {
            type: String,
            enum: ["table", "takeaway","delivery"],
            default:"table",
            required:true,
        },
        status: {
            type: String,
            enum: ["placed", "confirmed","accepted","completed","cancelled"],
            default:"placed",
            required:true,
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid"],
            default:"unpaid",
            required:true,
        },
        salesType: {
            type: String,
            enum: ["immediate", "booking"],
            default:"immediate",
            required:true,
        },
        order_ticket_notes: {
            type: String,
            default:"",
            required:false, 
        },
        booking_details :{
            delivery_datetime:{type:Date,required:false},
            is_door_delivery:{type:Boolean,required:false},
            booking_notes:{type:String,required:false},
            booking_advance:{type:String,required:false},
        },
        additional_details: {
            type: String,
            default:"",
            required:false, 
        },
        cancellation_details: {
            cancellation_reason: {
                type: String,
                default:"",
                required:false, 
            },
            cancelled_by: {
                type: Schema.Types.ObjectId,
                ref: "registers",
                required: false
            },
            refund_amount: {
                type: Number,
                required: false
            },
            refund_pay_type : {
                 type: String,
                 enum: ["cash", "card","other"],
                 default:"cash",
                 required:false,
            }
        },
        
        bulk_discount_detail: {
            discount_type :{type: String, enum: ["cash", "percentage"],required:false},
            discount :{type: Number,required:false},
        },
        coupon_applied:{
            type: Schema.Types.ObjectId,
            ref: "discount_rules",
            required: false
        },
        totals:{
            type:Number,
            required: true
        },
        payment_type : {
            type: String,
            enum: ["cash", "card","other"],
            default:"cash",
            required:false,
        }
       
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  ordersSchema.plugin(softDelete);
  
  const Orders = mongoose.model("orders", ordersSchema);
  
  module.exports = Orders;
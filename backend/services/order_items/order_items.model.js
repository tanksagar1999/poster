const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const orderItemsSchema = new Schema(
    {
        order_id: {
            type: Schema.Types.ObjectId,
            ref: "orders",
            required: false
        },
        items :[{
            product_id:{type:Schema.Types.ObjectId,ref: "products",required:false},
            name :{type:String,required:false},
            price : {type:Number,required:false},
            qty:{type:Number,required:false},
            discount:{type:Number,required:false},
            total:{type:Number,required:false}
        }],
        total_discount: {
            type:Number,
            required: false
        },
        sub_total:{
            type:Number,
            required: true
        },
       
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  orderItemsSchema.plugin(softDelete);
  
  const OrderItems = mongoose.model("order_items", orderItemsSchema);
  
  module.exports = OrderItems;
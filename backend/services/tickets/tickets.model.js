const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const ticketsSchema = new Schema(
    {
        order_id: {
            type: Schema.Types.ObjectId,
            ref: "orders",
            required: false
        },
        ticket_number:{
            type:String,
            required: true
        },
        items :[{
            product_name:{type:String,required:false},
            qty:{type:Number,required:false}
        }],
        action: {
            type: String,
            enum: ["added", "removed"],
            default : "added",
            required:false,
        },
        created_by: {
            type: Schema.Types.ObjectId,
            ref: "restaurant_users",
            required: false
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  ticketsSchema.plugin(softDelete);
  
  const Tickets = mongoose.model("tickets", ticketsSchema);
  
  module.exports = Tickets;
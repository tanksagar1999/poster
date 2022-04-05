const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const orderTicketGroupsSchema = new Schema(
    {  
        order_ticket_group_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  orderTicketGroupsSchema.plugin(softDelete);
  
  const Taxes = mongoose.model("order_ticket_groups", orderTicketGroupsSchema);
  
  module.exports = Taxes;
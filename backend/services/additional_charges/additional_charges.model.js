const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const additionalChargesSchema = new Schema(
    {  
        charge_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        charge_type: {
            type: String,
            enum: ["cash","percentage"],
            default: "cash",
            required:false,
        },
        charge_value: {
            type: Number,
            default: 0,
            required: false
        },
        tax_group: {
            type: Schema.Types.ObjectId,
            ref: "tax_groups",
        },
        order_type: {
            type: String,
            enum: ["all_orders", "take_away", "delivery", "dine_in"],
            default: "all_orders",
            required:false,
        },
        is_automatically_added: {
            type: Boolean,
            default: false,
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  additionalChargesSchema.plugin(softDelete);
  
  const AdditionalCharges = mongoose.model("additional_charges", additionalChargesSchema);
  
  module.exports = AdditionalCharges;
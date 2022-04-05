const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const taxesSchema = new Schema(
    {  
        tax_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        tax_percentage: {
            type: Number,
            default: 0,
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  taxesSchema.plugin(softDelete);
  
  const Taxes = mongoose.model("taxes", taxesSchema);
  
  module.exports = Taxes;
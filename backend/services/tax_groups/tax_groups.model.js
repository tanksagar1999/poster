const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const taxGroupsSchema = new Schema(
    {  
        tax_group_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        taxes: [
            {
              type: Schema.Types.ObjectId,
              ref: "taxes",
            } 
        ],
        taxes_inclusive_in_product_price: {
            type: Boolean,
            default: false,
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  taxGroupsSchema.plugin(softDelete);
  
  const TaxGroups = mongoose.model("tax_groups", taxGroupsSchema);
  
  module.exports = TaxGroups;
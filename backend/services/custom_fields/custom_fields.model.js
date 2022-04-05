const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const customFieldsSchema = new Schema(
    {  
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        type: {
            type: String,
            enum: ["payment_type", "petty_cash_category", "additional_detail", "tag"],
            default: "payment_type",
            required:false,
        },
        name: {
            type: String,
            default: "",
            required: false
        },
        description: {
            type: String,
            required: false
        },
        sub_type: {
            type: String,
            enum: ["customer","sale"],
            required:false,
        },
        print_this_field_on_receipts: {
            type: Boolean,
            required: false
        },
        tag_color: {
            type: String,
            required: false
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  customFieldsSchema.plugin(softDelete);
  
  const CustomFields = mongoose.model("custom_fields", customFieldsSchema);
  
  module.exports = CustomFields;
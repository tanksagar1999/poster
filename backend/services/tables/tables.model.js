const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const tablesSchema = new Schema(
    {  
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        table_number: {
            type: Number,
            default: 0,
            required: true
        },
        table_prefix: {
            type: String,
            default: "",
            required: false
        },
        table_type: {
            type: String,
            enum: ["numbers", "string","alphanumeric","groups","take-away","delivery"],
            default: "numbers",
            required: true
        },
        group_name: {
            type: String,
            default: "",
            required: false
        },
        group_table_number: {
            type: String,
            default: "",
            required: false
        },
        status: {
            type: String,
            enum: ["Empty", "Serving","Unpaid","Paid","Occupied"],
            default:"Empty",
            required:true,
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  tablesSchema.plugin(softDelete);
  
  const Tables = mongoose.model("tables", tablesSchema);
  
  module.exports = Tables;
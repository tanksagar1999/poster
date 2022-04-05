const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const printersSchema = new Schema(
    {
        printer_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: true
        },
        printer_type: {
            type: String,
            enum: ["network-print", "bluetooth-print", "android-print", "air-print","silent-print"],
            required: false
        },
        printer_size: {
            type: String,
            enum: ["80mm", "58mm", "A4", "A5"],
            default: "80mm",
            required: false
        },
        number_of_printable: {
            type: Number,
            required: false,
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  printersSchema.plugin(softDelete);
  
  const Printers = mongoose.model("printers", printersSchema);
  
  module.exports = Printers;
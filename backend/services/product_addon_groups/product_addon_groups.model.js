const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productAddonGroupsSchema = new Schema(
    {
        addon_group_name: {
            type: String,
            required: true
        },
        register_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        product_addons: [
            {
              type: Schema.Types.ObjectId,
              ref: "product_addons",
            } 
        ],
        minimum_selectable: {
            type: Number,
            required: false,
            default: 0
        },
        maximum_selectable: {
            type: Number,
            required: false,
            default: 0
        },
        sort_order: {
            type: Number,
            required: false,
            default: 0
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  productAddonGroupsSchema.plugin(softDelete);
  
  const ProductAddonGroups = mongoose.model("product_addon_groups", productAddonGroupsSchema);
  
  module.exports = ProductAddonGroups;
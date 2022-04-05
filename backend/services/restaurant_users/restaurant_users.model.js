const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const restaurantUsersSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        restaurant_admin_id: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: true
        },
        register_assigned_to: {
            type: Schema.Types.ObjectId,
            ref: "registers",
            required: false
        },
        role: {
            type: String,
            enum: ["cashier", "app_user", "waiter", "kitchen_user","owner"],
            default: "cashier",
            required: false
        },
        pin: {
            type: String,
            required: true
        },
        has_manager_permission: {
            type: Boolean,
            required: false,
            default: false
        },
        account_status: {
            type: String,
            enum: ["locked", "unlocked", "disabled"],
            required: false,
            default: "locked"
        },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );
  
  restaurantUsersSchema.plugin(softDelete);
  
  const RestaurantUsers = mongoose.model("restaurant_users", restaurantUsersSchema);
  
  module.exports = RestaurantUsers;
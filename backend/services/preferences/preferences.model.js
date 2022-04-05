const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require("mongoosejs-soft-delete");

const Schema = mongoose.Schema;

const preferencesSchema = new Schema(
	{
		register_id: {
			type: Schema.Types.ObjectId,
			ref: "registers",
			required: true,
		},
		selling_preferences: {
			do_not_round_off_sale_total: { type: Boolean, default: false },
			display_items_in_sell_screen_as_a_list_instead_of_grid: {
				type: Boolean,
				default: false,
			},
			enforce_sequential_local_receipt_numbers: {
				type: Boolean,
				default: false,
			},
			enable_order_ticket_kot_genration: {
				type: Boolean,
				default: false,
			},
			enable_automatic_order_ticket_kot_genration_for_incoming_orders: {
				type: Boolean,
				default: false,
			},
			enable_quick_billing: { type: Boolean, default: false },
			hide_quantity_increase_decrease_buttons: {
				type: Boolean,
				default: false,
			},
			hide_all_and_top_categories: { type: Boolean, default: false },
			enforce_customer_mobile_number: { type: Boolean, default: false },
			enable_billing_only_when_shift_is_opened: {
				type: Boolean,
				default: false,
			},
			show_incoming_dine_in_orders_on_waiter_app: {
				type: Boolean,
				default: false,
			},
			create_receipt_while_fullfilling_booking: {
				type: Boolean,
				default: false,
			},
			dark_mode: { type: Boolean, default: false },
		},
		printing_preferences: {
			print_receipt_first_then_accept_payment: {
				type: Boolean,
				default: false,
			},
			print_product_notes_in_the_receipt: {
				type: Boolean,
				default: false,
			},
			do_not_print_tax_rates_against_each_product: {
				type: Boolean,
				default: false,
			},
			do_not_print_copy_of_receipt_and_order_tickets: {
				type: Boolean,
				default: false,
			},
			print_register_name_on_receipt: { type: Boolean, default: false },
			print_order_ticket_KOT_number_in_the_receipt: {
				type: Boolean,
				default: false,
			},
			print_server_copy_of_order_ticket_KOT: {
				type: Boolean,
				default: false,
			},
			print_settlement_bill_after_accepting_payment: {
				type: Boolean,
				default: false,
			},
		},
		permission_preferences: {
			allow_cashiers_to_offer_discounts: {
				type: Boolean,
				default: false,
			},
			allow_managers_to_change_email_address_while_requesting_reports: {
				type: Boolean,
				default: false,
			},
			hide_the_shift_summary_link_in_lock_screen: {
				type: Boolean,
				default: false,
			},
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

preferencesSchema.plugin(softDelete);

const Preferences = mongoose.model("preferences", preferencesSchema);

module.exports = Preferences;

const { commonResponse } = require("../../helper");
const userModel = require("../users/users.model");
const additionalController = require("../additional_charges/additional_charges.controller");
const productAddonGroupsModel = require("../product_addon_groups/product_addon_groups.model");
const productAddonController = require("../product_addons/product_addons.controller");
const customFieldsModel = require("../custom_fields/custom_fields.model");
const discountRulesModel = require("../discount_rules/discount_rules.model");
const preferencesModel = require("../preferences/preferences.model");
const productCategoryModel = require("../product_category/product_category.model");
const productPriceBooksModel = require("../product_price_books/product_price_books.model");
const registerModel = require("../registers/registers.model");
const taxGroupController = require("../tax_groups/tax_groups.controller");
const taxesModel = require("../taxes/taxes.model");
const productVariantGroupsModel = require("../product_variant_groups/product_variant_groups.model");
const productVariantsController = require("../product_variants/product_variants.controller");
const customerModel = require("../customers/customers.model");
const orderTicketGroupsModel = require("../order_ticket_groups/order_ticket_groups.model");
const orderModel = require("../orders/orders.model");
const pettyCashesModel = require("../petty_cash/petty_cash.model");
const printersModel = require("../printers/printers.model");
const productModel = require("../products/products.model");
const receiptsModel = require("../receipts/receipts.model");
const shiftsModel = require("../shifts/shifts.model");
const tableModel = require("../tables/tables.model");
const salesModel = require("../sales/sales.model");
const restaurantUsersModel = require("../restaurant_users/restaurant_users.model");
const RestaurantUsersService = require("../restaurant_users/restaurant_users.services");
const shopController = require("../shops/shops.controller");
const registerController = require("../registers/registers.controller");
const productController = require("../products/products.controller");
const taxesController = require("../taxes/taxes.controller");
const productItemGroups = require("../product_item_groups/product_item_groups.controller");
const shiftsServices = require("../shifts/shifts.services");
/*
 *  Get All Data for Local Storage
 */
exports.getSetupData = async (req, params, orignalreq, res) => {
	// console.log("params Register ID =>",params);
	let query = {};
	query.restaurant_admin_id = req.register_id;
	query.role = {
		$ne: "owner",
	};
	console.log("Query =>", query);

	let data = {};
	data.account = await userModel.findById(params.id).lean();
	data.additionalCharges = await additionalController.list(
		orignalreq,
		res,
		"local"
	);
	data.customFields = await customFieldsModel.find(req);
	data.discountRules = await discountRulesModel.find(req);
	data.orderTicketGroups = await orderTicketGroupsModel.find(req);
	// data.pettyCashes = await pettyCashesModel.find(req);
	data.preferences = await preferencesModel.find(req);
	data.productAddonGroups = await productAddonGroupsModel.find(req);
	data.productAddon = await productAddonController.list(
		orignalreq,
		res,
		"local"
	);
	data.productCategory = await productCategoryModel.find(req);
	data.productPriceBooks = await productPriceBooksModel.find(req);
	data.productVariantGroups = await productVariantGroupsModel.find(req);
	data.productVariants = await productVariantsController.list(
		orignalreq,
		res,
		"local"
	);
	data.products = await productController.list(orignalreq, res, "local");
	data.itemGroups = await productItemGroups.list(orignalreq, res, "local");

	// Find Register by ID Start
	data.register = await registerController.list(orignalreq, res, "local");
	// Find Register by ID End
	data.shifts = await shiftsModel.find(req);
	data.table = await tableModel.find(req);
	data.taxGroups = await taxGroupController.list(orignalreq, res, "local");
	data.taxes = await taxesController.list(orignalreq, res, "local");
	data.userList = await restaurantUsersModel
		.find(query)
		.populate([
			{
				path: "register_assigned_to",
				select: "register_name",
			},
		])
		.sort({
			created_at: -1,
		})
		.lean();
	data.shopDetails = await shopController.getShops(orignalreq, res, "local");
	data.recent_activity = await shiftsServices.list(orignalreq.user);
	return data;
};

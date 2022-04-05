const { usersRoutes } = require("../services/users");
const { productCategoryRoutes } = require("../services/product_category");
const { additionalChargesRoutes } = require("../services/additional_charges");
const { productTaxesRoutes } = require("../services/taxes");
const { productTaxGroupsRoutes } = require("../services/tax_groups");
const { customFieldsRoutes } = require("../services/custom_fields");
const { preferencesRoutes } = require("../services/preferences");
const { productAddonsRoutes } = require("../services/product_addons");
const {
	productAddonGroupsRoutes,
} = require("../services/product_addon_groups");
const { productVariantsRoutes } = require("../services/product_variants");
const {
	productVariantGroupsRoutes,
} = require("../services/product_variant_groups");
const { registersRoutes } = require("../services/registers");
const { productsRoutes } = require("../services/products");
const { restaurantUsersRoutes } = require("../services/restaurant_users");
const { shopsRoutes } = require("../services/shops");
const { productItemGroupsRoutes } = require("../services/product_item_groups");
const { pettyCashRoutes } = require("../services/petty_cash");
const { discountRulesRoutes } = require("../services/discount_rules");
const { productPriceBooksRoutes } = require("../services/product_price_books");
const { customersRoutes } = require("../services/customers");
const { orderTicketGroupsRoutes } = require("../services/order_ticket_groups");
const { tablesRoutes } = require("../services/tables");
const { ordersRoutes } = require("../services/orders");
const { ordersItemsRoutes } = require("../services/order_items");
const { receiptsRoutes } = require("../services/receipts");
const { printersRoutes } = require("../services/printers");
const { shiftsRoutes } = require("../services/shifts");
const { dashboardRoutes } = require("../services/dashboard");
const { ticketsRoutes } = require("../services/tickets");
const { salesRoutes } = require("../services/sales");
const { localStorageRoutes } = require("../services/localStorage");
const { lastDeviceRoutes } = require("../services/last_device");

const initialize = (app) => {
	app.use("/api/users", usersRoutes);
	app.use("/api/product/category", productCategoryRoutes);
	app.use("/api/product/additional_charges", additionalChargesRoutes);
	app.use("/api/product/taxes", productTaxesRoutes);
	app.use("/api/product/tax_groups", productTaxGroupsRoutes);
	app.use("/api/custom_fields", customFieldsRoutes);
	app.use("/api/preferences", preferencesRoutes);
	app.use("/api/product/addons", productAddonsRoutes);
	app.use("/api/product/addon_groups", productAddonGroupsRoutes);
	app.use("/api/product/variants", productVariantsRoutes);
	app.use("/api/product/variant_groups", productVariantGroupsRoutes);
	app.use("/api/registers", registersRoutes);
	app.use("/api/products", productsRoutes);
	app.use("/api/restaurant/users", restaurantUsersRoutes);
	app.use("/api/shops", shopsRoutes);
	app.use("/api/product/item_groups", productItemGroupsRoutes);
	app.use("/api/petty_cash", pettyCashRoutes);
	app.use("/api/discount_rules", discountRulesRoutes);
	app.use("/api/product/price_books", productPriceBooksRoutes);
	app.use("/api/customers", customersRoutes);
	app.use("/api/product/order_ticket_groups", orderTicketGroupsRoutes);
	app.use("/api/tables", tablesRoutes);
	app.use("/api/orders", ordersRoutes);
	app.use("/api/order_items", ordersItemsRoutes);
	app.use("/api/receipts", receiptsRoutes);
	app.use("/api/printers", printersRoutes);
	app.use("/api/shifts", shiftsRoutes);
	app.use("/api/dashboard", dashboardRoutes);
	app.use("/api/tickets", ticketsRoutes);
	app.use("/api/sales", salesRoutes);
	app.use("/api/localStorage", localStorageRoutes);
	app.use("/api/last_device", lastDeviceRoutes);
	app.use("/authError", (req, res, next) => {
		return next(new Error("DEFAULT_AUTH"));
	});

	app.get("/ping", (req, res) => {
		res.status(200).send({
			success: true,
			statusCode: 200,
		});
	});
};

module.exports = { initialize };

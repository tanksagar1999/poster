import { Switch } from "react-router";

/**
 * It's suggested to configure the RESTful endpoints in this file
 * so that there is only one source of truth, future update of endpoints
 * could be done from here without refactoring on multiple places throughout the app
 */
const API = {
  auth: {
    register: "users/register",
    login: "users/login",
    forgotPassword: "users/forgot-password",
    resetPassword: "users/reset-password",
    secretPinAuth: "restaurant/users/secret-pin-auth",
    lockRegister: "restaurant/users/lock",
    forgotPin: "restaurant/users/forgot-pin",
  },
  products: {
    addProduct: "products",
    getProducts: "products",
    updateProducts: "products",
    deleteAllProduct: "products/deleteAll",
    getCategoryList: "product/category",
    addProductCategory: "product/category",
    getAllOrderTicketGroupList: "product/order_ticket_groups",
    addOrderTicketGroup: "product/order_ticket_groups",
    deleteAllOrderTicketGrouped: "product/order_ticket_groups/deleteAll",
    deleteAllProductCategory: "product/category/deleteAll",
    importProductGroup: "products/import/preview",
    importPreview: "products/import",
    exportProduct: "products/export",
    searchProductList: "products/list",
    topSell: "sales/topList",
  },
  variants: {
    getVariantList: "product/variants",
    addVariant: "product/variants",
    importVariant: "product/variants/import/preview",
    importPreview: "product/variants/import",
    deleteAllVariant: "product/variants/deleteAll",
    exportVariant: "product/variants/export",
  },
  addons: {
    getAddonList: "product/addons",
    addAddon: "product/addons",
    importAddon: "product/addons/import/preview",
    importPreview: "product/addons/import",
    deleteAllAddon: "product/addons/deleteAll",
    exportAddon: "product/addons/export",
  },
  variantsGroup: {
    getVariantGroupList: "product/variant_groups",
    addVariantGroup: "product/variant_groups",
    importVariantGroup: "product/variant_groups/import/preview",
    importPreview: "product/variant_groups/import",
    deleteAllVariantGroup: "product/variant_groups/deleteAll",
    exportVariantGroup: "product/variant_groups/export",
  },
  addonsGroup: {
    getAddonGroupList: "product/addon_groups",
    addAddonGroup: "product/addon_groups",
    importAddonGroup: "product/addon_groups/import/preview",
    importPreview: "product/addon_groups/import",
    deleteAllAddonGroup: "product/addon_groups/deleteAll",
    exportAddonGroup: "product/addon_groups/export",
  },
  itemGroup: {
    getItemGroupList: "product/item_groups",
    addItemGroup: "product/item_groups",
    deleteAllItemGroup: "product/item_groups/deleteAll",
  },
  customer: {
    list: "customers",
    export: "customers/export",
    detail: "customers",
    update: "customers",
    add: "customers",
    exportCustomer: "customers/export",
    Customerdetail: "customers",
    Customerupdate: "customers",
    Customeradd: "customers",
    importCustomer: "customers/import/preview",
    importPreview: "customers/import",
    searchList: "customers",
  },
  shop: {
    add: "shops",
  },
  enquiry: {
    list: "users/pending",
    changeStatus: "users/changeStatus",
  },
  users: {
    list: "users/all",
    deactiveStatus: "users/changeStatus",
    getUserById: "users/get-profile",
    updateUserDetail: "users/update",
    deleteUser: "users/deleteAll",
    exportUser: "users/export",
  },
  pricebook: {
    addPriceBook: "product/price_books",
    getAllRegisters: "registers",
    getAllPriceBook: "product/price_books",
    getPriceBookById: "product/price_books",
    deleteAllPriceBook: "product/price_books/deleteAll",
    updateProductPricebook: "product/price_books/manage",
    getAllPricebookProducts: "products/bypricebook",
    getAllPricebookAddons: "product/addons/bypricebook",
    getAllPricebookVariants: "product/variants/bypricebook",
    exportPricebookProducts: "products/bypricebookexport",
    exportPricebookAddons: "product/addons/bypricebookexport",
    exportPricebookVariants: "product/variants/bypricebookexport",
    importProductList: "products/bypricebookexport/import/preview",
    importProductData: "products/bypricebookexport/import",
    importAddonsList: "product/addons/bypricebookexport/import/preview",
    importAddonsData: "product/addons/bypricebookexport/import",
  },

  taxGroup: {
    getAllTaxGroup: "product/tax_groups",
    getTaxName: "product/taxes",
    addTaxGroup: "product/tax_groups",
    getTaxesById: "product/tax_groups",
    deleteAllTaxGroup: "product/tax_groups/deleteAll",
  },
  taxes: {
    addTaxes: "product/taxes",
    getAllTaxes: "product/taxes",
    getTaxesById: "product/taxes",
    deleteAllTaxes: "product/taxes/deleteAll",
  },
  cashiers: {
    addCashiers: "restaurant/users",
    getAllCashiers: "restaurant/users",
    deleteAllCashiers: "restaurant/users/deleteAll",
    getcashiersById: "restaurant/users",
  },
  appUser: {
    addAppUser: "restaurant/users",
    getAllAppUser: "restaurant/users",
    deleteAllAppUser: "restaurant/users/deleteAll",
    getAppUserById: "restaurant/users",
  },
  kitchenUser: {
    addKitchenUser: "restaurant/users",
    getAllKitchenUser: "restaurant/users",
    deleteAllKitchenUser: "restaurant/users/deleteAll",
    getKitchenUserById: "restaurant/users",
  },
  waiterUser: {
    addWaiterUser: "restaurant/users",
    getAllWaiterUser: "restaurant/users",
    deleteAllWaiterUser: "restaurant/users/deleteAll",
    getWaiterUserById: "restaurant/users",
  },
  addtionalCharge: {
    addAddtionalCharge: "product/additional_charges",
    getAllAddtionalCharge: "product/additional_charges",
    getAddtionalChargeById: "product/additional_charges",
    deleteAllAddtionalCharge: "product/additional_charges/deleteAll",
  },
  customField: {
    addCustomField: "custom_fields",
    getAllPaymentType: "custom_fields?type=payment_type",
    getAllPattyCash: "custom_fields?type=petty_cash_category",
    getCustomFieldById: "custom_fields",
    deleteAllCustomField: "custom_fields/deleteAll",
    getAllAddtional: "custom_fields?type=additional_detail",
    getAllTag: "custom_fields?type=tag",
  },
  register: {
    getAllRegister: "registers",
    SwitchCurrentRegister: "registers/switch",
    addRegister: "registers",
    deleteAllRegister: "registers/deleteAll",
    getRegisterById: "registers",
  },
  prefernce: {
    addPrefernce: "preferences",
    getPreferenceById: "preferences",
  },
  pattyCash: {
    addPatty: "petty_cash",
    getAllPatty: "petty_cash",
    getDate: "petty_cash?",
    exportOfPatty: "petty_cash/export",
    deletePatty: "petty_cash",
  },
  recepits: {
    getAllReceipts: "receipts",
    getReceiptsById: "receipts",
    canselorder: "sales/cancel",
    deleteReceipt: "receipts",
  },
  shift: {
    UpdateShift: "shifts",
  },
  discountRules: {
    addDiscountRules: "discount_rules",
    getAlldiscountRules: "discount_rules",
    getDiscountRulesById: "discount_rules",
    deleteAllDiscountRules: "discount_rules/deleteAll",
  },
  sell: {
    getAllTables: "tables",
    createOrder: "sales",
    createBooking: "sales/draft",
    getAllBooking: "sales/getbookings",
    getBookingById: "sales",
    updateBooking: "sales",
    getLastRecepitNumber: "receipts/getLastReceipt",
    getLastDevice: "last_device",


  },
  dashboard: {
    getAllData: "dashboard",
  },
};

export { API };

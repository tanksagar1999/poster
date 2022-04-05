import actions from './actions';

const initialState = {
  mainVariantList: [],
  variantList: [],
  PreviewList: [],
  PreviewData: {},
  searchText: '',
  variantData: {},
  deletedItem: {},
};

const {

  VARIANT_LIST,
  VARIANT_LIST_ERR,
  VARIANT_BY_ID,
  VARIANT_BY_ID_ERR,
  VARIANT_DELETE,
  VARIANT_DELETE_ERR,
  VARIANT_ADD,
  VARIANT_ADD_ERR,
  VARIANT_IMPORT_PREVIEW_LIST,
  VARIANT_IMPORT_PREVIEW_ERR,
  VARIANT_IMPORT_DATA,
  VARIANT_IMPORT_DATA_ERR,

} = actions;

const variantReducer = (state = initialState, action = {}) => {
  const { mainVariantList } = state;
  const {
    variantData,
    err,
    PreviewList,
    PreviewData

  } = actions;

  switch (action.type) {
    case 'VARIANT_LIST':
      return { ...state, mainVariantList: [...action.payload], variantList: [...action.payload] };
    case 'VARIANT_LIST_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_ADD':
      return {
        ...state, variantData,
      };
    case 'VARIANT_ADD_ERR':
      return {
        ...state,
        err,
      };
    case 'PRODUCT_CATEGORY_DELETE':
      return {
        ...state,
        deletedItem,
      };
    case 'VARIANT_DELETE_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_BY_ID':
      return {
        ...state,
        categoryData,
      };
    case 'VARIANT_BY_ID_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_IMPORT_PREVIEW_LIST':
      return {
        ...state, PreviewList,
      };
    case 'VARIANT_IMPORT_PREVIEW_ERR':
      return {
        ...state,
        err,
      };
    case 'VARIANT_IMPORT_DATA':
      return {
        ...state, PreviewData,
      };
    case 'VARIANT_IMPORT_DATA_ERR':
      return {
        ...state,
        err,
      };
    default: return state;
  }
};

export { variantReducer }
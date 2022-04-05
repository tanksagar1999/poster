import actions from "./actions";

const initialState = {
  mainItemGroupList: [],
  itemGroupList: [],
  searchText: "",
  itemGroupData: {},
  deletedItem: {},
};

const {
  ITEM_GROUP_LIST,
  ITEM_GROUP_LIST_ERR,
  ITEM_GROUP_BY_ID,
  ITEM_GROUP_BY_ID_ERR,
  ITEM_GROUP_DELETE,
  ITEM_GROUP_DELETE_ERR,
  ITEM_GROUP_ADD,
  ITEM_GROUP_ADD_ERR,
} = actions;

const itemGroupReducer = (state = initialState, action = {}) => {
  const { mainItemGroupList } = state;
  const { itemGroupData, err, deletedItem } = actions;

  switch (action.type) {
    case "ITEM_GROUP_LIST":
      return {
        ...state,
        mainItemGroupList: [...action.payload],
        itemGroupList: [...action.payload],
      };
    case "ITEM_GROUP_LIST_ERR":
      return {
        ...state,
        err,
      };
    case "ITEM_GROUP_ADD":
      return {
        ...state,
        itemGroupData,
      };
    case "ITEM_GROUP_ADD_ERR":
      return {
        ...state,
        err,
      };
    case "ITEM_GROUP_DELETE":
      return {
        ...state,
        deletedItem,
      };
    case "ITEM_GROUP_DELETE_ERR":
      return {
        ...state,
        err,
      };
    case "ITEM_GROUP_BY_ID":
      return {
        ...state,
        addonGroupData,
      };
    case "ITEM_GROUP_BY_ID_ERR":
      return {
        ...state,
        err,
      };

    default:
      return state;
  }
};

export { itemGroupReducer };

const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const {
  ItemGroupAdd,
  ItemGroupAddErr,
  ItemGroupList,
  ItemGroupListErr,
  ItemGroupDelete,
  ItemGroupDeleteErr,
  ItemGroup,
  ItemGroupErr,
} = actions;

export const getAllItemGroupList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.itemGroups && checkSell == "sell") {
        return dispatch(ItemGroupList(allSetupcache.itemGroups));
      } else {
        const ItemGroupDataList = await DataService.get(
          API.itemGroup.getItemGroupList
        );
        if (!ItemGroupDataList.data.error) {
          allSetupcache.itemGroups = ItemGroupDataList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(ItemGroupList(ItemGroupDataList.data.data));
        } else {
          return dispatch(VariantGroupListErr(ItemGroupDataList.data));
        }
      }
    } catch (err) {
      dispatch(ItemGroupListErr(err));
    }
  };
};

export const UpdateItemGroup = (payloads, item_id) => {
  return async (dispatch) => {
    try {
      let getItemGroup = {};
      getItemGroup = await DataService.put(
        API.itemGroup.addItemGroup + "/" + item_id,
        payloads
      );
      if (!getItemGroup.data.error) {
        return dispatch(ItemGroupAdd(getItemGroup.data));
      } else {
        return dispatch(ItemGroupAddErr(getItemGroup.data));
      }
    } catch (err) {
      dispatch(ItemGroupAddErr(err));
    }
  };
};

export const SingleAddItemGroup = (payloads) => {
  return async (dispatch) => {
    try {
      let getItemGroup = {};
      getItemGroup = await DataService.post(
        API.itemGroup.addItemGroup,
        payloads
      );
      if (!getItemGroup.data.error) {
        return dispatch(ItemGroupAdd(getItemGroup.data));
      } else {
        return dispatch(ItemGroupAddErr(getItemGroup.data));
      }
    } catch (err) {
      dispatch(ItemGroupAddErr(err));
    }
  };
};

export const getItemGroupById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let itemgroupDetails;
      if (allSetupcache && allSetupcache.itemGroups) {
        itemgroupDetails = allSetupcache.itemGroups.find(
          (val) => val._id == id
        );
      }
      if (itemgroupDetails) {
        return itemgroupDetails;
      } else {
        const Detail = await DataService.get(
          API.itemGroup.getItemGroupList + "/" + id
        );

        if (!Detail.data.error) {
          return Detail.data.data;
        } else {
          return dispatch(ItemGroup(Detail.data));
        }
      }
    } catch (err) {
      dispatch(ItemGroupErr(err));
    }
  };
};

export const deleteItemGroup = (itemIds) => {
  return async (dispatch) => {
    try {
      const getDeletedItemGroup = await DataService.post(
        API.itemGroup.deleteAllItemGroup,
        itemIds
      );
      if (!getDeletedItemGroup.data.error) {
        return dispatch(ItemGroupDelete(getDeletedItemGroup.data));
      } else {
        return dispatch(ItemGroupDeleteErr(getDeletedItemGroup.data));
      }
    } catch (err) {
      dispatch(ItemGroupAddErr(err));
    }
  };
};

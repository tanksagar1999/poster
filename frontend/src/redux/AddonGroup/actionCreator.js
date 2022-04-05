const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const {
  AddonGroupAdd,
  AddonGroupAddErr,
  AddonGroupList,
  AddonGroupListErr,
  AddonGroupDelete,
  AddonGroupDeleteErr,
  AddonGroup,
  AddonGroupErr,
  AddonGroupImportPreview,
  AddonGroupImportPreviewErr,
  AddonGroupImportData,
  AddonGroupImportDataErr,
} = actions;

export const getAllAddonGroupList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");

      if (checkSell == "sell" && allSetupcache?.productAddonGroups) {
        return dispatch(AddonGroupList(allSetupcache?.productAddonGroups));
      } else {
        const AddonGroupDataList = await DataService.get(
          API.addonsGroup.getAddonGroupList
        );
        if (!AddonGroupDataList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.productAddonGroups = AddonGroupDataList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(AddonGroupList(AddonGroupDataList.data.data));
        } else {
          return dispatch(AddonGroupListErr(AddonGroupDataList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.productAddonGroups) {
        return dispatch(AddonGroupList(allSetupcache.productAddonGroups));
      } else {
        return dispatch(AddonGroupListErr(err));
      }
    }
  };
};

export const ExportAddonGroup = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.variants.exportVariant, payloads);
  };
};

export const UpdateAddonGroup = (payloads, variant_id) => {
  return async (dispatch) => {
    try {
      let getAddonGroup = {};
      getAddonGroup = await DataService.put(
        API.addonsGroup.addAddonGroup + "/" + variant_id,
        payloads
      );
      if (!getAddonGroup.data.error) {
        let getallSetUpcacheData = getItem("setupCache");
        if (
          getallSetUpcacheData &&
          getallSetUpcacheData.productAddonGroups?.length > 0
        ) {
          getallSetUpcacheData.products.map((val) => {
            if (val.product_option?.option_addon_group?.length > 0) {
              val.product_option?.option_addon_group.map((j) => {
                console.log(
                  "getVariant.data",
                  getAddonGroup.data.data._id,
                  val
                );
                let latestAddonGroupList = [];
                if (j._id == getAddonGroup.data.data._id) {
                  latestAddonGroupList.push(getAddonGroup.data.data);
                } else {
                  latestAddonGroupList.push(j);
                }
                val.product_option.option_addon_group = latestAddonGroupList;
              });
            }
          });
          console.log("kkkkkkkkkkk", getallSetUpcacheData.products);
          setItem("setupCache", getallSetUpcacheData);
        }
        return dispatch(AddonGroupAdd(getAddonGroup.data));
      } else {
        return dispatch(AddonGroupAddErr(getAddonGroup.data));
      }
    } catch (err) {
      dispatch(AddonGroupAddErr(err));
    }
  };
};
export const AddAddonGroupData = (payloads) => {
  return async (dispatch) => {
    try {
      let getAddonGroup = {};
      getAddonGroup = await DataService.post(
        API.addonsGroup.addAddonGroup,
        payloads
      );
      if (!getAddonGroup.data.error) {
        return dispatch(AddonGroupAdd(getAddonGroup.data));
      } else {
        return dispatch(AddonGroupAddErr(getAddonGroup.data));
      }
    } catch (err) {
      dispatch(AddonGroupAddErr(err));
    }
  };
};

export const ImportAddonGroupInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.addonsGroup.importAddonGroup,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(AddonGroupImportPreview(getPreview.data));
      } else {
        return dispatch(AddonGroupImportPreviewErr(getPreview.data));
      }
    } catch (err) {
      dispatch(AddonGroupImportPreviewPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.addonsGroup.importPreview,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(AddonGroupImportData(getPreview.data));
      } else {
        return dispatch(AddonGroupImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(AddonGroupImportDataErr(err));
    }
  };
};

export const getAddonGroupById = (id) => {
  return async (dispatch) => {
    try {
      let localData = getItem("setupCache");
      let addonGroupDetals;
      if (localData && localData.productAddonGroups) {
        addonGroupDetals = localData.productAddonGroups.find(
          (k) => k._id == id
        );
      }

      if (addonGroupDetals) {
        let data = addonGroupDetals.product_addons.map((val) => val._id);
        addonGroupDetals.product_addons = data;
        return addonGroupDetals;
      } else {
        const Detail = await DataService.get(
          API.addonsGroup.getAddonGroupList + "/" + id
        );
        if (!Detail.data.error) {
          console.log("detais909", Detail.data.data);
          console.log("detais9091", addonGroupDetals);
          return Detail.data.data;
        } else {
          return dispatch(AddonGroup(Detail.data));
        }
      }
    } catch (err) {
      dispatch(AddonGroupErr(err));
    }
  };
};

export const deleteAddonGroup = (addonIds) => {
  return async (dispatch) => {
    try {
      let getDeletedAddonGroup = {};
      getDeletedAddonGroup = await DataService.post(
        API.addonsGroup.deleteAllAddonGroup,
        addonIds
      );
      if (!getDeletedAddonGroup.data.error) {
        return dispatch(AddonGroupDelete(getDeletedAddonGroup.data));
      } else {
        return dispatch(AddonGroupDeleteErr(getDeletedAddonGroup.data));
      }
    } catch (err) {
      dispatch(AddonGroupDeleteErr(err));
    }
  };
};

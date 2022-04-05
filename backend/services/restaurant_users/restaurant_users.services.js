const {
        commonResponse
} = require("../../helper");
const Model = require("./restaurant_users.model");

/*
 *  Save New  
 */
exports.save = async (reqBody) => {

        const newRestaurantUsers = new Model(reqBody);
        return await newRestaurantUsers.save();

};

/*
 *  List  
 */
exports.list = async (req) => {

        let query = req;
        query.role = {
                $ne: 'owner'
        };
        return await Model.find(query).populate([{
                path: "register_assigned_to",
                select: "register_name"
        }]).sort({
                created_at: -1
        }).lean();

};

/*
 *  unlock  
 */
exports.unlock = async (req) => {

        let query = req;
        // return await Model.find(query).populate([
        //     {
        //         path: "assigned_to"
        //     }
        // ]).lean();
        return await Model.find(query).lean();

};

/*
 *  Update  
 */
exports.update = async (id, reqBody) => {

        let update = await Model.findOneAndUpdate({
                _id: id
        }, {
                $set: reqBody
        }, {
                new: true,
        }).lean();
        return update;

};

/*
 *  Delete  
 */
exports.delete = async (id) => {

        return await Model.removeOne({
                _id: id
        });

};

/*
 *  Delete multiple
 */
exports.deleteAll = async (reqBody) => {

        return await Model.removeMany({
                _id: {
                        $in: reqBody.ids
                }
        });

};
/*
 *  Get By Id
 */
exports.getById = async (id) => {

        return await Model.findById(id);

};

/*
 *  List  
 */
exports.getOwnerPin = async (req) => {

        let query = req;
        query.role = 'owner';
        return await Model.find(query).sort({
                created_at: -1
        }).lean();

};

exports.checkHaveCashierUsers = async (body) => {

        let q = {};
        q['register_assigned_to'] = {
                $in: body.ids
        };
        q["role"] = "cashier";
        let result = await Model.find(q).lean();
        return result.length > 0 ? result.length : false;

};

exports.CheckPinExist = async (req) => {

        let query = req;
        
        return await Model.find(query).populate([{
                path: "register_assigned_to",
                select: "register_name"
        }]).sort({
                created_at: -1
        }).lean();

};

exports.findAndupdate = async (query,reqBody) => {

        let update = await Model.findOneAndUpdate(query, {
                $set: reqBody
        }, {
                new: true,
        }).lean();
        return update;

};
exports.deleteAllByRegister = async (query) => {
   
        return await Model.removeMany(query); 
     
};
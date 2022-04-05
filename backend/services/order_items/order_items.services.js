const {
    commonResponse
} = require("../../helper");
const Model = require("./order_items.model");

/*
 *  Save  
 */
exports.save = async (reqBody) => {
     
        const newCustomers = new Model(reqBody);
        return await newCustomers.save();
     
};

/*
 *  List  
 */
exports.list = async (req) => {
   

        let query = {};

        query = req;

        return await Model.find(query).skip(parseInt(req.offset)).limit(parseInt(req.limit)).sort({
            created_at: -1
        }).lean();

  
};

/*
 *  Export  
 */
exports.export = async (req) => {
     
        let query = {};

        query = req;

        return await Model.aggregate([{
                "$lookup": {
                    "from": "registers",
                    "localField": "register_id",
                    "foreignField": "_id",
                    "as": "registers"
                }
            },
            {
                "$unwind": "$registers"
            },
            {
                "$project": {
                    "mobile": "$mobile",
                    "name": "$name",
                    "email": "$email",
                    "street_address": "$street_address",
                    "city": "$city",
                    "zipcode": "$zipcode",
                    "register_id": "$registers.register_name",
                    "created_at": "$created_at"

                }
            },
            {
                $sort: {
                    created_at: -1
                }
            }
        ]);
     
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

exports.getByOrderId = async (id) => {
    
    return await Model.find({order_id:id});
 
};

/*
 *  get Top Selling Of Day  
 */
exports.getTopSellingOfDay = async (req) => {
    
        let items = await Model.find({
            created_at: {
                $gte: new Date(req.startDate + " 00:00:00"),
                $lt: new Date(req.endDate + " 23:59:59")
            }
        }).populate([{
            path: "order_id",
            match: {
                paymentStatus: "paid",
                created_at: {
                    $gte: new Date(req.startDate + " 00:00:00"),
                    $lt: new Date(req.endDate + " 23:59:59")
                },
                register_id : req.register_id
            }
        }, ]).lean();
        let allitems = [];
        for (let i of items) {
            allitems = allitems.concat(i.items);
        }
        let countsellofitems = {};
        for (let j of allitems) {
            countsellofitems[j.name] = j.qty + (typeof countsellofitems[j.name] != "undefined" ? countsellofitems[j.name] : 0);
        }
        console.log('all', countsellofitems);
        let sortable = [];
        for (let v in countsellofitems) {
            sortable.push([v, countsellofitems[v]]);
        }
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        let filtr = [];
        for (let v in sortable) {
            filtr.push({
                "product_name": sortable[v][0],
                "qty": sortable[v][1]
            });
        }

        return filtr;
     
};
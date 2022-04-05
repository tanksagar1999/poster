const {
    commonResponse
} = require("../../helper");
const Model = require("./tickets.model");

/*
 *  Save  
 */
exports.save = async (reqBody) => {
    
        const newTickets = new Model(reqBody);
        return await newTickets.save();
    
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

        return Model.find({
                created_at: {
                    $gte: new Date(query.startDate + " 00:00:00"),
                    $lt: new Date(query.endDate + " 23:59:59")
                }
            })
            .populate([
                {
                    path: "order_id",
                    populate: {
                        path: "register_id",
                        select: "register_name"
                    },
                },
                {
                    path: "created_by",
                    select: "username -_id"
                },
            ]).lean();
    
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


exports.getLastTicketsofDay = async (req) => {
    
        return await Model.find({
            created_at: {
                $gte: new Date(req + " 00:00:00"),
                $lt: new Date(req + " 23:59:59")
            }
        }).sort({
            created_at: -1
        }).limit(1).lean();
    
};
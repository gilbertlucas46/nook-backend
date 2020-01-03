"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.paginate = async (Model, pipeline, limit, page) => {
    try {
        if (limit) {
            limit = Math.abs(limit);
            if (limit > constants_1.SERVER.MAX_LIMIT)
                limit = constants_1.SERVER.MAX_LIMIT;
        }
        else
            limit = constants_1.SERVER.LIMIT;
        if (page && (page !== 0))
            page = Math.abs(page);
        else
            page = 1;
        const skip = (limit * (page - 1));
        const result = await Model.aggregate(queryBuilder(pipeline, skip, limit, page)).exec();
        const theTotal = result[0]['metadata'] && result[0]['metadata'][0] ? result[0]['metadata'][0]['total'] : 0;
        const thePage = result[0]['metadata'] && result[0]['metadata'][0] ? result[0]['metadata'][0]['page'] : page;
        let pageToSend = -1;
        if (theTotal > (thePage * limit))
            pageToSend = thePage + 1;
        return {
            data: result[0]['data'],
            total: theTotal,
            page: pageToSend,
            limit,
        };
    }
    catch (err) {
        throw new Error(err);
    }
};
const queryBuilder = (pipeline, skip, limit, page) => {
    const q = pipeline || [];
    q.push({
        $facet: {
            data: [
                { $skip: skip },
                { $limit: limit },
            ],
            metadata: [{ $count: 'total' }, { $addFields: { page } }],
        },
    });
    return q;
};
//# sourceMappingURL=paginate.util.js.map
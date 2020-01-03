'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Models = require("../models");
const mongoose = require("mongoose");
const constants_1 = require("../constants");
class DAOManager {
    constructor() {
        this.ObjectId = mongoose.Types.ObjectId;
    }
    async saveData(model, data) {
        try {
            let ModelName = Models[model];
            data.createdDate = new Date().getTime();
            return await new ModelName(data).save();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async getData(model, query, projection, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.find(query, projection, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async distinct(model, path, query) {
        try {
            let ModelName = Models[model];
            return await ModelName.distinct(path, query);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async findOne(model, query, projection, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.findOne(query, projection, options).exec();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async findAll(model, query, projection, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.find(query, projection, options).exec();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async findAndUpdate(model, conditions, update, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.findOneAndUpdate(conditions, update, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async findAndRemove(model, conditions, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.findOneAndRemove(conditions, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async updateMany(model, conditions, update, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.updateMany(conditions, update, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async remove(model, condition) {
        try {
            let ModelName = Models[model];
            return await ModelName.remove(condition);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async populateData(model, query, projection, options, collectionOptions) {
        try {
            let ModelName = Models[model];
            return await ModelName.find(query, projection, options).populate(collectionOptions).exec();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async count(model, condition) {
        try {
            let ModelName = Models[model];
            return await ModelName.count(condition);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async aggregateData(model, aggregateArray, options) {
        try {
            let ModelName = Models[model];
            let aggregation = ModelName.aggregate(aggregateArray);
            return await aggregation.exec();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async insert(model, data, options = {}) {
        try {
            let ModelName = Models[model];
            let obj = new ModelName(data);
            await obj.save();
            return obj;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async insertMany(model, data, options) {
        try {
            let ModelName = Models[model];
            return await ModelName.insertMany(data, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async aggregateDataWithPopulate(model, group, populateOptions) {
        try {
            let ModelName = Models[model];
            let aggregate = await ModelName.aggregate(group);
            let populate = await ModelName.populate(aggregate, populateOptions);
            return populate;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async populateDataOnAggregate(model, aggregate, populateOptions) {
        try {
            let ModelName = Models[model];
            return await ModelName.populate(aggregate, populateOptions);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async bulkFindAndUpdate(bulk, query, update, options) {
        try {
            return await bulk.find(query).upsert().update(update, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async bulkFindAndUpdateOne(bulk, query, update, options) {
        try {
            return await bulk.find(query).upsert().updateOne(update, options);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    ;
    async paginate(model, pipeline, limit, page) {
        try {
            let ModelName = Models[model];
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
            let queryData = await this.queryBuilder(pipeline, skip, limit, page);
            const result = await ModelName.aggregate(queryData).exec();
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
    }
    ;
    async queryBuilder(pipeline, skip, limit, page) {
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
    }
    ;
}
exports.DAOManager = DAOManager;
;
//# sourceMappingURL=dao.js.map
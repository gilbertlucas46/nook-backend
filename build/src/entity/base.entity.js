"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Services = require("../databases/dao");
const mongoose = require("mongoose");
const constants_1 = require("../constants");
class BaseEntity {
    constructor(modelName) {
        this.ObjectId = mongoose.Types.ObjectId;
        this.DAOManager = new Services.DAOManager();
        this.modelName = modelName;
    }
    async createOneEntity(saveData) {
        try {
            let data = await this.DAOManager.saveData(this.modelName, saveData);
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity createOneEntity  ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async createMulti(saveData) {
        try {
            let data = await this.DAOManager.insertMany(this.modelName, saveData, {});
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity createOneEntity  ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async getOneEntity(criteria, projection) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, criteria, projection, { lean: true });
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity getOneEntity ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async updateOneEntity(criteria, dataToUpdate, option) {
        try {
            if (option == undefined)
                option = { new: true, lean: true };
            let data = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, option);
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity updateOneEntity ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async getById(_id, projection) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, { _id: _id }, projection, { lean: true });
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity getById ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async getMultiple(criteria, projection) {
        try {
            let data = await this.DAOManager.getData(this.modelName, criteria, projection, { lean: true });
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity getMultiple ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async getDistinct(key, criteria) {
        try {
            let data = await this.DAOManager.distinct(this.modelName, key, criteria);
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity getDistinct ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async updateMultiple(criteria, projection, option) {
        try {
            if (option == undefined)
                option = { new: true, multi: true };
            let data = await this.DAOManager.updateMany(this.modelName, criteria, projection, option);
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity updateMultiple ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async aggregate(pipeline, option) {
        try {
            if (option == undefined)
                option = { lean: true };
            let data = await this.DAOManager.aggregateData(this.modelName, pipeline, option);
            return data;
        }
        catch (error) {
            console.log("Error in Base Entity updateMultiple ", this.modelName, error);
            return Promise.reject(error);
        }
    }
    async paginate(Model, pipeline, limit, page) {
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
            const result = await Model.aggregate(this.queryBuilder(pipeline, skip, limit, page)).exec();
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
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base.entity.js.map
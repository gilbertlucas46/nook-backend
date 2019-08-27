import * as Services from '../databases/dao';
import * as mongoose from "mongoose";
import * as Constant from '../constants'

export class BaseEntity {
    public ObjectId = mongoose.Types.ObjectId;
    public DAOManager = new Services.DAOManager();
    protected modelName: ModelNames;
    constructor(modelName?) {
        this.modelName = modelName
    }

    async createOneEntity(saveData: Object) {
        try {
            let data = await this.DAOManager.saveData(this.modelName, saveData)
            return data
        } catch (error) {
            console.log("Error in Base Entity createOneEntity  ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async createMulti(saveData: any) {
        try {
            let data = await this.DAOManager.insertMany(this.modelName, saveData, {})
            return data
        } catch (error) {
            console.log("Error in Base Entity createOneEntity  ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getOneEntity(criteria: Object, projection: Object) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, criteria, projection, { lean: true })
            return data
        } catch (error) {
            console.log("Error in Base Entity getOneEntity ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async updateOneEntity(criteria: Object, dataToUpdate: Object, option?) {
        try {
            if (option == undefined)
                option = { new: true, lean: true }
            let data = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, option)
            return data
        } catch (error) {
            console.log("Error in Base Entity updateOneEntity ", this.modelName, error)
            return Promise.reject(error)
        }

    }

    async getById(_id: string, projection: Object) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, { _id: _id }, projection, { lean: true })
            return data
        } catch (error) {
            console.log("Error in Base Entity getById ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getMultiple(criteria: Object, projection: Object) {
        try {
            let data = await this.DAOManager.getData(this.modelName, criteria, projection, { lean: true })
            return data
        } catch (error) {
            console.log("Error in Base Entity getMultiple ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async getDistinct(key: string, criteria: Object) {
        try {
            let data = await this.DAOManager.distinct(this.modelName, key, criteria)
            return data
        } catch (error) {
            console.log("Error in Base Entity getDistinct ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    async updateMultiple(criteria: Object, projection: Object, option?) {
        try {
            if (option == undefined)
                option = { new: true, multi: true }
            let data = await this.DAOManager.updateMany(this.modelName, criteria, projection, option)
            return data
        } catch (error) {
            console.log("Error in Base Entity updateMultiple ", this.modelName, error)
            return Promise.reject(error)
        }
    }

    // async aggregate(pipeline, option?) {
    //     try {
    //         if (option == undefined)
    //             option = { lean: true }
    //         let data = await this.DAOManager.aggregateData(this.modelName, pipeline, option)
    //         return data
    //     } catch (error) {
    //         console.log("Error in Base Entity updateMultiple ", this.modelName, error)
    //         return Promise.reject(error)
    //     }
    // }
}
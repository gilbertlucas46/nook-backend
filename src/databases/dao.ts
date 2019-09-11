'use strict';
import * as Models from '../models';
import * as mongoose from "mongoose";
import { SERVER } from '../constants';
export class DAOManager {
    public ObjectId = mongoose.Types.ObjectId;
    constructor() {

    }
    async saveData(model: ModelNames, data) {
        try {
            let ModelName = Models[model]
            data.createdDate = new Date().getTime()
            return await new ModelName(data).save();
        }
        catch (error) {
            return Promise.reject(error)
        }
    };

    async getData(model: ModelNames, query: any, projection: any, options: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.find(query, projection, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async distinct(model: ModelNames, path: string, query: any) {
        try {
            let ModelName = Models[model]
            return await ModelName.distinct(path, query);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findOne(model: ModelNames, query, projection, options?) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOne(query, projection, options).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findAll(model: ModelNames, query, projection, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.find(query, projection, options).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findAndUpdate(model: ModelNames, conditions, update, options?) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOneAndUpdate(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async findAndRemove(model: ModelNames, conditions, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.findOneAndRemove(conditions, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async updateMany(model: ModelNames, conditions, update, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.updateMany(conditions, update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async remove(model: ModelNames, condition) {
        try {
            let ModelName = Models[model]
            return await ModelName.remove(condition);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async populateData(model: ModelNames, query, projection, options, collectionOptions) {
        try {
            let ModelName = Models[model];
            return await ModelName.find(query, projection, options).populate(collectionOptions).exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async count(model: ModelNames, condition) {
        try {
            let ModelName = Models[model]
            return await ModelName.count(condition);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async aggregateData(model: ModelNames, aggregateArray, options) {
        try {
            let ModelName = Models[model]
            let aggregation = ModelName.aggregate(aggregateArray);
            //  if (options) { aggregation.options = options; }
            return await aggregation.exec();
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async insert(model: ModelNames, data, options = {}) {
        try {
            let ModelName = Models[model]
            let obj = new ModelName(data)
            await obj.save()
            return obj
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async insertMany(model: ModelNames, data, options) {
        try {
            let ModelName = Models[model]
            return await ModelName.insertMany(data, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async aggregateDataWithPopulate(model: ModelNames, group, populateOptions) {
        try {
            let ModelName = Models[model]
            let aggregate = await ModelName.aggregate(group);
            let populate = await ModelName.populate(aggregate, populateOptions)
            return populate
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async populateDataOnAggregate(model: ModelNames, aggregate, populateOptions) {
        try {
            let ModelName = Models[model]
            return await ModelName.populate(aggregate, populateOptions)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async bulkFindAndUpdate(bulk, query, update, options) {
        try {
            return await bulk.find(query).upsert().update(update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };

    async bulkFindAndUpdateOne(bulk, query, update, options) {
        try {
            return await bulk.find(query).upsert().updateOne(update, options);
        } catch (error) {
            return Promise.reject(error)
        }
    };


    async  paginate(model: ModelNames, pipeline?: Array<Object>, limit?: number, page?: number) {
        try {
            let ModelName = Models[model];
            if (limit) {
                limit = Math.abs(limit);
                // If limit exceeds max limit
                if (limit > SERVER.MAX_LIMIT) limit = SERVER.MAX_LIMIT;
            } else limit = SERVER.LIMIT;

            if (page && (page !== 0)) page = Math.abs(page);
            else page = 1;

            const skip = (limit * (page - 1));
            let queryData = await this.queryBuilder(pipeline, skip, limit, page);
            const result = await ModelName.aggregate(queryData).exec();
            const theTotal = result[0]['metadata'] && result[0]['metadata'][0] ? result[0]['metadata'][0]['total'] : 0;
            const thePage = result[0]['metadata'] && result[0]['metadata'][0] ? result[0]['metadata'][0]['page'] : page;
            let pageToSend = -1;
            if (theTotal > (thePage * limit)) pageToSend = thePage + 1;

            return {
                data: result[0]['data'],
                total: theTotal,
                page: pageToSend,
                limit,
            };
        } catch (err) {
            throw new Error(err);
        }
    };

    async queryBuilder(pipeline: Array<Object>, skip: number, limit: number, page: number) {
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
};
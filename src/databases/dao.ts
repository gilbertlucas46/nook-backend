'use strict';
import * as Models from '@src/models';
import { Types, Model, Document } from 'mongoose';
import { SERVER } from '@src/constants';
import { ModelNames } from '@src/interfaces/model.interface';
import * as utils from 'src/utils';

export class DAOManager {
	constructor() { }
	ObjectId = Types.ObjectId;
	async saveData(model: ModelNames, data) {
		try {
			const ModelName: Model<any> = Models[model];
			data.createdAt = new Date().getTime();
			data.updatedAt = new Date().getTime();
			return await new ModelName(data).save();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @description A function to save a document into the collection
	 * @param model Collection model name.
	 * @param data payload for a document
	 */
	async save<T extends Document>(model: ModelNames, data: any): Promise<T> {
		data['createdAt'] = new Date().getTime();
		data['updatedAt'] = new Date().getTime();
		const EntityModel: Model<T> = Models[model] as any;
		return await EntityModel.create(data);
	}
	/**
	 * @description A function to store multiple documents into the collection
	 * @param model Collection model name.
	 * @param data payload for documents
	 */
	async store<T extends Document>(model: ModelNames, data: any): Promise<T[]> {
		const EntityModel: Model<T> = Models[model] as any;
		const docs: T[] = await EntityModel.insertMany(data) as any;
		return docs;
	}

	async getData1<T extends Document>(model: ModelNames, query: any, projection: any, options?: any): Promise<T> {
		try {
			const EntityModel: Model<T> = Models[model] as any;
			return EntityModel.findOne(query, projection, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async getData(model: ModelNames, query: any, projection: any, options: any) {
		try {
			const ModelName: Model<any> = Models[model];
			return ModelName.find(query, projection, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async distinct(model: ModelNames, path: string, query: any) {
		try {
			const ModelName = Models[model];
			return await ModelName.distinct(path, query);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async findOne(model: ModelNames, query, projection, options?) {
		try {
			const ModelName: Model<any> = Models[model];
			return await ModelName.findOne(query, projection, options).exec();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async findAll(model: ModelNames, query, projection = {}, options = {}) {
		try {
			const ModelName: Model<any> = Models[model];
			return await ModelName.find(query, projection, options).exec();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async findAllWithSort(model: ModelNames, query, projection = {}, sort = {}, options = {}) {
		try {
			const ModelName: Model<any> = Models[model];
			return await ModelName.find(query, projection, options).sort(sort).exec();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async findAndUpdate(model: ModelNames, conditions, update, options?) {
		try {
			update['updatedAt'] = new Date().getTime();
			const ModelName: Model<any> = Models[model];
			return ModelName.findOneAndUpdate(conditions, update, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async findAndRemove(model: ModelNames, conditions, options?) {
		try {
			const ModelName: Model<any> = Models[model];
			return ModelName.findOneAndRemove(conditions, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async updateMany(model: ModelNames, conditions, update, options) {
		try {
			update['updatedAt'] = new Date().getTime();
			const ModelName = Models[model];
			return await ModelName.updateMany(conditions, update, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async remove(model: ModelNames, condition) {
		try {
			const ModelName = Models[model];
			return await ModelName.remove(condition);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async populateData(model: ModelNames, query, projection, options, collectionOptions) {
		try {
			const ModelName: Model<any> = Models[model];
			return await ModelName.find(query, projection, options).populate(collectionOptions).exec();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async count(model: ModelNames, condition) {
		try {
			const ModelName = Models[model];
			return await ModelName.count(condition);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async aggregateData(model: ModelNames, aggregateArray, options?) {
		try {
			const ModelName = Models[model];
			const aggregation = ModelName.aggregate(aggregateArray);
			return await aggregation.exec();
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async insert(model: ModelNames, data, options = {}) {
		try {
			const ModelName: Model<any> = Models[model];
			const obj = new ModelName(data);
			await obj.save();
			return obj;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async insertMany(model: ModelNames, data, options) {
		try {
			const ModelName: Model<any> = Models[model];
			return await ModelName.insertMany(data, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async aggregateDataWithPopulate(model: ModelNames, group, populateOptions) {
		try {
			const ModelName = Models[model];
			const aggregate = await ModelName.aggregate(group);
			return await ModelName.populate(aggregate, populateOptions);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async populateDataOnAggregate(model: ModelNames, aggregate, populateOptions) {
		try {
			const ModelName = Models[model];
			return await ModelName.populate(aggregate, populateOptions);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async bulkFindAndUpdate(bulk, query, update, options) {
		try {
			return await bulk.find(query).upsert().update(update, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async bulkFindAndUpdateOne(bulk, query, update, options) {
		try {
			return await bulk.find(query).upsert().updateOne(update, options);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async  paginate(model: ModelNames, pipeline?: object[], limit?: number, page?: number) {
		try {
			const ModelName = Models[model];
			if (limit) {
				limit = Math.abs(limit);
				if (limit > SERVER.MAX_LIMIT) { limit = SERVER.MAX_LIMIT; }
			} else { limit = SERVER.LIMIT; }

			if (page && (page !== 0)) {
				page = Math.abs(page);
			} else {
				page = 1;
			}

			const skip = (limit * (page - 1));
			const queryData = await this.queryBuilder(pipeline, skip, limit, page);
			const result = await ModelName.aggregate(queryData).exec();
			const theTotal = result[0].metadata && result[0].metadata[0] ? result[0].metadata[0].total : 0;
			const thePage = result[0].metadata && result[0].metadata[0] ? result[0].metadata[0].page : page;
			let pageToSend = -1;
			if (theTotal > (thePage * limit)) { pageToSend = thePage + 1; }

			return {
				data: result[0].data,
				total: theTotal,
				page: pageToSend,
				limit,
			};
		} catch (error) {
			utils.consolelog('error', error, true);
			throw new Error(error);
		}
	}

	async queryBuilder(pipeline: object[], skip: number, limit: number, page: number) {
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

	paginatePipeline(matchPipeline: object[], options: { page: number, limit: number, skip?: number }, pipeline: object[]) {
		const aggrPipeline = [
			...matchPipeline,
			{
				$facet: {
					data: [
						{
							$skip: options.skip || (options.page - 1) * options.limit,
						}, {
							$limit: options.limit,
						},
						...pipeline,
					],
					meta: [
						{ $count: 'total' },
					],
				},
			}, {
				$project: {
					data: 1,
					page: {
						$literal: options.page,
					},
					limit: {
						$literal: options.limit,
					},
					total: {
						$arrayElemAt: ['$meta.total', 0],
					},
				},
			},
		];
		return {
			pipeline: aggrPipeline,
			async aggregate<T extends Document = any>(model: string, allowDiskUse: boolean = false) {
				const CollectionModel: Model<T> = Models[model];
				const result = await CollectionModel.aggregate(aggrPipeline).allowDiskUse(allowDiskUse).exec(); return result[0];
			},
		};
	}


}

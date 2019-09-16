import * as Services from '../databases/dao';
import * as mongoose from 'mongoose';
import { SERVER } from '../constants';

export class BaseEntity {
	objectId = mongoose.Types.ObjectId;
	DAOManager = new Services.DAOManager();
	protected modelName: ModelNames;
	constructor(modelName?) {
		this.modelName = modelName;
	}

	async createOneEntity(saveData: object) {
		try {
			const data = await this.DAOManager.saveData(this.modelName, saveData);
			return data;
		} catch (error) {
			console.log('Error in Base Entity createOneEntity  ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async createMulti(saveData: any) {
		try {
			const data = await this.DAOManager.insertMany(this.modelName, saveData, {});
			return data;
		} catch (error) {
			console.log('Error in Base Entity createOneEntity  ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async getOneEntity(criteria: object, projection: object) {
		try {
			const data = await this.DAOManager.findOne(this.modelName, criteria, projection, { lean: true });
			return data;
		} catch (error) {
			console.log('Error in Base Entity getOneEntity ', this.modelName, error);
			return Promise.reject(error);
		}

	}

	async updateOneEntity(criteria: object, dataToUpdate: object, option?) {
		try {
			if (option === undefined) {
				option = { new: true, lean: true };
			}
			const data = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, option);
			return data;
		} catch (error) {
			console.log('Error in Base Entity updateOneEntity ', this.modelName, error);
			return Promise.reject(error);
		}

	}

	async getById(id: string, projection: object) {
		try {
			const data = await this.DAOManager.findOne(this.modelName, { _id: id }, projection, { lean: true });
			return data;
		} catch (error) {
			console.log('Error in Base Entity getById ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async getMultiple(criteria: object, projection: object) {
		try {
			const data = await this.DAOManager.getData(this.modelName, criteria, projection, { lean: true });
			return data;
		} catch (error) {
			console.log('Error in Base Entity getMultiple ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async getDistinct(key: string, criteria: object) {
		try {
			const data = await this.DAOManager.distinct(this.modelName, key, criteria);
			return data;
		} catch (error) {
			console.log('Error in Base Entity getDistinct ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async updateMultiple(criteria: object, projection: object, option?) {
		try {
			if (!option) {
				option = { new: true, multi: true };
			}
			const data = await this.DAOManager.updateMany(this.modelName, criteria, projection, option);
			return data;
		} catch (error) {
			console.log('Error in Base Entity updateMultiple ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async aggregate(pipeline, option?) {
		try {
			if (option == undefined) {
				option = { lean: true };
			}
			const data = await this.DAOManager.aggregateData(this.modelName, pipeline, option);
			return data;
		} catch (error) {
			console.log('Error in Base Entity updateMultiple ', this.modelName, error);
			return Promise.reject(error);
		}
	}

	async  paginate(Model: any, pipeline?: object[], limit?: number, page?: number) {
		try {
			if (limit) {
				limit = Math.abs(limit);
				// If limit exceeds max limit
				if (limit > SERVER.MAX_LIMIT) { limit = SERVER.MAX_LIMIT; }
			} else { limit = SERVER.LIMIT; }

			if (page && (page !== 0)) {
				page = Math.abs(page);
			} else {
				page = 1;
			}

			const skip = (limit * (page - 1));
			const result = await Model.aggregate(this.queryBuilder(pipeline, skip, limit, page)).exec();
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
		} catch (err) {
			throw new Error(err);
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
}

import * as Services from '@src/databases/dao';
import * as mongoose from 'mongoose';
import { SERVER } from '@src/constants';
import { ModelNames } from '@src/interfaces/model.interface';
import { consolelog } from '@src/utils/index';

export class BaseEntity {
	objectId = mongoose.Types.ObjectId;
	DAOManager = new Services.DAOManager();
	protected modelName: ModelNames;
	constructor(modelName?) {
		this.modelName = modelName;
	}

	async createOneEntity(saveData: object) {
		try {
			saveData['createdAt'] = new Date().getTime();
			saveData['updatedAt'] = new Date().getTime();
			return await this.DAOManager.saveData(this.modelName, saveData);
		} catch (error) {
			consolelog(`Error in Base Entity createOneEntity method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async createMulti(saveData: any) {
		try {
			return await this.DAOManager.insertMany(this.modelName, saveData, {});
		} catch (error) {
			consolelog(`Error in Base Entity in MultipleEntity method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async getOneEntity(criteria: object, projection: object, lean: boolean = true) {
		try {
			console.log("criteria.......",criteria);
			return await this.DAOManager.findOne(this.modelName, criteria, projection, { lean });
		} catch (error) {
			consolelog(`Error in Base Entity in getOneEntity method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async count(condition: object) {
		try {
			return await this.DAOManager.count(this.modelName, condition);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateOneEntity(criteria: object, dataToUpdate: object, option?) {
		try {
			console.log('optionoptionoptionoption', option);
			if (option === undefined) {
				option = {
					new: true,
					lean: true,
					$setOnInsert: {
						updatedAt: new Date().getTime(),
					},
				};
			}
			else if (option === false) {
				dataToUpdate['updatedAt'] = new Date().getTime();
				// option['new'] = false;
				// option['lean'] = true;
				// '$setOnInsert' = {
				// 	updatedAt: new Date().getTime(),
				// };
			}
			else {
				option['new'] = true;
				option['lean'] = true;
				if (!option['$setOnInsert']) {
					option['$setOnInsert'] = {};
				}
				option['$setOnInsert']['updatedAt'] = new Date().getTime();
			}

			return await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate, option);
		} catch (error) {
			consolelog(`Error in Base Entity in updateOneEntity method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}

	}

	async getById(id: string, projection: object) {
		try {
			return await this.DAOManager.findOne(this.modelName, { _id: id }, projection, { lean: true });
		} catch (error) {
			consolelog(`Error in Base Entity in  getById method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async getMultiple(criteria: object, projection: object) {
		try {
			return await this.DAOManager.getData(this.modelName, criteria, projection, { lean: true });
		} catch (error) {
			consolelog(`Error in Base Entity in getMultiple method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async getDistinct(key: string, criteria: object) {
		try {
			return await this.DAOManager.distinct(this.modelName, key, criteria);
		} catch (error) {
			consolelog(`Error in Base Entity in getDistinct method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async updateMultiple(criteria: object, projection: object, option?) {
		try {
			if (!option) {
				option = {
					new: true, multi: true,
					$setOnInsert: {
						updatedAt: new Date().getTime(),
					},
				};
			} else {
				option['new'] = true;
				option['lean'] = true;
				option['$setOnInsert'] = {
					updatedAt: new Date().getTime(),
				};
			}
			return await this.DAOManager.updateMany(this.modelName, criteria, projection, option);
		} catch (error) {
			consolelog(`Error in Base Entity in updateMultiple method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async removeEntity(criteria: object) {
		try {
			return await this.DAOManager.findAndRemove(this.modelName, criteria);
		} catch (error) {
			consolelog('Base entity removeEntity', error, false);
			return Promise.reject(error);
		}
	}

	async aggregate(pipeline, option?) {
		try {
			if (!option) {
				option = { lean: true };
			}
			return await this.DAOManager.aggregateData(this.modelName, pipeline, option);
		} catch (error) {
			consolelog(`Error in Base Entity in aggregate method ${this.modelName}`, error, true);
			return Promise.reject(error);
		}
	}

	async  paginate(Model: any, pipeline?: object[], limit?: number, page?: number) {
		try {
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

import { BaseEntity } from '@src/entity/base/base.entity';
 import { LoanReferralDocument } from '@src/models/referral';
class LoanReferral extends BaseEntity {
    constructor() {
        super('LoanReferral');
    }

    async createReferral(payload) {
        try {
            const doc = await this.DAOManager.save<LoanReferralDocument>(this.modelName, payload);
            return doc;
        } catch (error) {
            console.log('errorerrorerrorerrorerror', error);
            return Promise.reject(error);
        }
    }

    async getReferral(payload) {
        try {
            const doc = await this.DAOManager.getData1<LoanReferralDocument>(this.modelName, payload, {});
            return doc;
        } catch (error) {
            console.log('errorerrorerrorerrorerror', error);
            return Promise.reject(error);
        }
    }

    async getUserReferral(payload, userData) {
        try {

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export const ReferalE = new LoanReferral();

// import { BaseEntity } from '@src/entity/base/base.entity';
// import { ICity, CityDocument } from '@src/models/city';
// import { Location } from '@src/interfaces/region.interface';

// class CityEntity extends BaseEntity {
// 	constructor() {
// 		super('City');
// 	}
// 	/**
// 	 * @description A function to insert document into collection.
// 	 * @param payload entity data
// 	 */
// 	async save(payload: ICity): Promise<CityDocument> {
// 		const document = await this.DAOManager.save<CityDocument>(this.modelName, payload);
// 		return document;
// 	}
// 	/**
// 	 * @description A function to insert multiple documents into collection.
// 	 * @param data entity info
// 	 */
// 	async store(payload: ICity[]): Promise<CityDocument[]> {
// 		const documents = await this.DAOManager.store<CityDocument>(this.modelName, payload);
// 		return documents;
// 	}
// 	async list(): Promise<Location.RegionLocationDocument[]> {
// 		const pipeline: any[] = [
// 			{
// 				$group: {
// 					_id: '$region',
// 					cities: {
// 						$push: '$$ROOT',
// 					},
// 				},
// 			},
// 			{
// 				$sort: {
// 					_id: 1,
// 				},
// 			},
// 			{
// 				$lookup: {
// 					from: 'regions',
// 					localField: '_id',
// 					foreignField: '_id',
// 					as: 'region',
// 				},
// 			},
// 			{
// 				$unwind: '$region',
// 			},
// 			{
// 				$project: {
// 					fullName: '$region.fullName',
// 					shortName: '$region.shortName',
// 					location: '$region.location',
// 					cities: 1,
// 				},
// 			},
// 		];
// 		const result = this.DAOManager.aggregateData(this.modelName, pipeline, {});
// 		return result;
// 	}
// 	async isEmpty(): Promise<boolean> {
// 		return !await this.DAOManager.count(this.modelName, {});
// 	}
// 	async clear() {
// 		await this.DAOManager.remove(this.modelName, {});
// 	}
// }

// export const cityEntity = new CityEntity();
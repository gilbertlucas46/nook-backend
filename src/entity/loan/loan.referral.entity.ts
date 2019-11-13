import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanReferralDocument } from '@src/models/referral';
import * as Constant from '@src/constants';
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
            const pipeline = [];
            let { page, limit, sortBy, sortType } = payload;
            const { searchTerm, property_status, fromDate, toDate, byCity, byRegion, property_type } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let matchObject: any = {};
            const skip = (limit * (page - 1));
            const promiseArray = [];

            // if (sortBy) {
            //     sortBy = 'Date';
            //     sortingType = {
            //         createdAt: sortType,
            //     };
            // }

            // if (fromDate && toDate) {
            //     matchObject['createdAt'] = {
            //         $gte: fromDate,
            //         $lte: toDate,
            //     };
            // }
            // else if (toDate) {
            //     matchObject['createdAt'] = {
            //         $lte: toDate,
            //     };
            // } else if (fromDate) {
            //     matchObject['createdAt'] = {
            //         $gte: fromDate,
            //         $lte: new Date().getTime(),
            //     };
            // }

            const criteria = {
                userId: userData._id,
            };

            promiseArray.push(this.DAOManager.findAll(this.modelName, criteria, {}, { limit, skip, sort: sortingType }));
            promiseArray.push(this.DAOManager.count(this.modelName, criteria));
            const [data, total] = await Promise.all(promiseArray);
            console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaa', data);
            console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaa', total);

            // pipeline.push(this.DAOManager.findAll('Property', matchObject, { propertyActions: 0 }, { limit, skip, sort: sortingType }));
            return {
                data, total,
            };
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

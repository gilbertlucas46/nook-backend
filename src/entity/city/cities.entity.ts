import { BaseEntity } from '@src/entity/base/base.entity';
import { ICity, CityDocument } from '@src/models/city';
import { Location } from '@src/interfaces/region.interface';
import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';

class CityEntity extends BaseEntity {
	constructor() {
		super('City');
	}
	/**
	 * @description A function to insert document into collection.
	 * @param payload entity data
	 */
	async save(payload: ICity): Promise<CityDocument> {
		const document = await this.DAOManager.save<CityDocument>(this.modelName, payload);
		return document;
	}
	/**
	 * @description A function to insert multiple documents into collection.
	 * @param data entity info
	 */
	async store(payload: ICity[]): Promise<CityDocument[]> {
		const documents = await this.DAOManager.store<CityDocument>(this.modelName, payload);
		return documents;
	}
	async list(): Promise<Location.RegionLocationDocument[]> {
		const pipeline: any[] = [
			{
				$group: {
					_id: '$region',
					cities: {
						$push: '$$ROOT',
					},
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$lookup: {
					from: 'regions',
					localField: '_id',
					foreignField: '_id',
					as: 'region',
				},
			},
			{
				$unwind: '$region',
			},
			{
				$project: {
					fullName: '$region.fullName',
					shortName: '$region.shortName',
					location: '$region.location',
					cities: 1,
				},
			},
		];
		return this.DAOManager.aggregateData(this.modelName, pipeline, {});
	}
	async isEmpty(): Promise<boolean> {
		return !await this.DAOManager.count(this.modelName, {});
	}
	async clear() {
		await this.DAOManager.remove(this.modelName, {});
	}
	async featuredList() {
		return this.DAOManager.findAll(this.modelName, { isFeatured: true }, { _id: 1, name: 1 });
	}

	async getCityData(payload): Promise<object> {
		return this.DAOManager.findOne(this.modelName, { _id: payload.cityId }, {}, {});
	}

	async getPopularCity(payload){
		try {
			let { page, limit } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			const skip = (limit * (page - 1));

			const pipeline = [
			// 	{
			// 		$match: {
			// 			isFeatured : true,
			// 		},
			// 	},
			// 	{
			// 		$project: {
			// 			cityId: '$_id',
			// 			images: 1,
			// 		},
			// 	},
			// 	{
            //         $lookup: {
            //             from: 'properties',
            //             let: {cityId: '$cityId' },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         $expr: {
            //                             $eq: ['$property_address.cityId', '$$cityId'],
            //                         },
            //                     },
			// 				},
			// 				// {
			// 				// 	$count: "passing_scores"
			// 				// },
            //                 // {
            //                 //     $project: {
			// 				// 		_id: 1,
			// 				// 		passing_scores : 1,
            //                 //     },
			// 				// },
            //             ],
            //             as: 'propertyData',
            //         },
			// 	},

			// 	// {
			// 	// 	$group: {
			// 	// 		_id: '$cityId',
			// 	// 		property: { $push: '$_id' },
			// 	// 	},
			// 	// },
			// 	// {
			// 	// 	$project: {
			// 	// 		cityId: '$_id',
			// 	// 		propertyCount: { $cond: { if: { $isArray: '$property' }, then: { $size: '$property' }, else: 0 } },
			// 	// 		_id: 0,
			// 	// 	},
			// 	// },
			// 	// {
			// 	// 	$sort: {
			// 	// 		propertyCount: -1,
			// 	// 	},
			// 	// },
			// 	// { $skip: skip },
			// 	// { $limit: limit },
			// 	// {
			// 	// 	$lookup:
			// 	// 	{
			// 	// 		from: 'cities',
			// 	// 		let: { id: '$cityId' },
			// 	// 		pipeline: [
			// 	// 			{
			// 	// 				$match: {
			// 	// 					$expr:
			// 	// 					{
			// 	// 						$eq: ['$_id', '$$id'],
			// 	// 					},
			// 	// 				},
			// 	// 			},
			// 	// 			{
			// 	// 				$project:
			// 	// 				{
			// 	// 					images: 1,
			// 	// 					name: 1,
			// 	// 				},
			// 	// 			},
			// 	// 		],
			// 	// 		as: 'cityData',
			// 	// 	},
			// 	// },
			// 	// {
			// 	// 	$unwind: {
			// 	// 		path: '$cityData',
			// 	// 		preserveNullAndEmptyArrays: true,
			// 	// 	},
			// 	// },
			// 	// {
			// 	// 	$project:
			// 	// 	{
			// 	// 		propertyCount: 1,
			// 	// 		cityId: 1,
			// 	// 		cityImages: '$cityData.images',
			// 	// 		cityName: '$cityData.name',
			// 	// 	},
			// 	// },
			 ];

			const popularCities = await this.DAOManager.aggregateData(this.modelName, pipeline);
			if (!popularCities) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
			return popularCities;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}

	}
}

export const cityEntity = new CityEntity();

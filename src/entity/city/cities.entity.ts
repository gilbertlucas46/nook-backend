import { BaseEntity } from '@src/entity/base/base.entity';
import { ICity, CityDocument } from '@src/models/city';
import { Location } from '@src/interfaces/region.interface';
import * as Constant from '@src/constants/app.constant';
// import { PropertyRequest } from '@src/interfaces/property.interface';

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

	// async getPopularCity(payload: PropertyRequest.PopularCity) {
	// 	let { limit, propertyType } = payload;
	// 	if (!limit) limit = 3;
	// 	if (!propertyType) propertyType = 1;

	// 	const pipeline: any[] = [
	// 		{
	// 			$match: {
	// 				isFeatured: true,
	// 			},
	// 		},
	// 		{
	// 			$project: {
	// 				cityId: '$_id',
	// 				images: 1,
	// 				name: 1,
	// 			},
	// 		},
	// 		{
	// 			$lookup: {
	// 				from: 'properties',
	// 				let: { cityId: '$cityId' },
	// 				pipeline: [
	// 					{
	// 						$match: {
	// 							$expr: {
	// 								$and: [
	// 									{ $eq: ['$property_address.cityId', '$$cityId'] },
	// 									{ $eq: ['$property_status.number', Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER] },
	// 									{ $eq: ['$property_basic_details.property_for_number', propertyType] },
	// 								],
	// 							},
	// 						},
	// 					},
	// 					{ $count: 'count' },
	// 				],
	// 				as: 'propertyData',
	// 			},
	// 		},
	// 		{
	// 			$addFields: {
	// 				propertyCount: { $sum: '$propertyData.count' },
	// 			},
	// 		},
	// 		{
	// 			$project: {
	// 				propertyData: 0,
	// 			},
	// 		},
	// 		{
	// 			$sort: {
	// 				propertyCount: -1,
	// 			},
	// 		},
	// 		{
	// 			$limit: limit,
	// 		},
	// 	];
	// 	return this.DAOManager.aggregateData(this.modelName, pipeline, {});
	// }
}

export const cityEntity = new CityEntity();

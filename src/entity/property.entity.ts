import { BaseEntity } from './base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants/app.constant';

export class PropertyClass extends BaseEntity {
	constructor() {
		super('Property');
	}

	async PropertyList(pipeline) {
		try {
			const propertyList = await this.DAOManager.paginate(this.modelName, pipeline);
			return propertyList;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async PropertyByStatus(query) {
		try {
			const data = await this.DAOManager.paginate(this.modelName, query);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getPropertyDetailsById(propertyId: string) {
		try {
			const criteria = [
				{
					$match: {
						_id: Types.ObjectId(propertyId),
					},
				},
				{
					$lookup: {
						from: 'regions',
						let: { regionId: '$property_address.region' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$regionId'],
									},
								},
							},
							{
								$project: {
									fullName: 1,
									_id: 1,
								},
							},
						],
						as: 'regionData',
					},
				},
				{
					$lookup: {
						from: 'cities',
						let: { cityId: '$property_address.city' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$cityId'],
									},
								},
							},
							{
								$project: {
									name: 1,
									_id: 1,
								},
							},
						],
						as: 'cityData',
					},
				},
				{
					$unwind: {
						path: '$regionData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						'property_features': 1,
						'updatedAt': 1,
						'createdAt': 1,
						'property_details': 1,
						'property_address.region': '$regionData.fullName',
						'property_address.regionId': '$regionData._id',
						'property_address.city': '$cityData.name',
						'property_address.cityId': '$cityData._id',
						'property_address.address': '$property_address.address',
						'property_address.barangay': '$property_address.barangay',
						'property_address.location': '$property_address.location',
						'propertyId': '$_id',
						'propertyShortId': '$propertyId',
						'property_basic_details': 1,
						'property_added_by': 1,
						'propertyImages': 1,
						'isFeatured': 1,
						'property_status': 1,
					},
				},
			];
			const getPropertyData = await this.DAOManager.aggregateData(this.modelName, criteria, {});
			if (!getPropertyData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID); }
			return getPropertyData[0];
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getPropertyList(payload) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			const matchObject: any = { $match: {} };
			let searchCriteria = {};
			if (searchTerm) {
				// for filtration
				searchCriteria = {
					$match: {
						$or: [
							{ 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
						],
					},
				};
			} else {
				searchCriteria = {
					$match: {
					},
				};
			}

			if (sortBy) {
				switch (sortBy) {
					case Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER:
						sortBy = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
						sortingType = {
							'property_status.number.Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER': sortType,
						};
						break;
					case Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER:
						sortBy = Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER;
						sortingType = {
							'property_status.number.Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER': sortType,
						};
						break;
					case 'price':
						sortBy = 'price';
						sortingType = {
							'property_basic_details.sale_rent_price': sortType,
						};
						break;
					case 'date':
						sortBy = 'date';
						sortingType = {
							createdAt: sortType,
						};
						break;
					case 'isFeatured':
						sortBy = 'isFeatured';
						sortingType = {
							sale_rent_price: sortType,
						};
						break;
					default:
						sortBy = 'createdAt';
						sortingType = {
							createdAt: sortType,
						};
						break;
				}
			}
			else {
				sortBy = 'createdAt';
				sortingType = {
					createdAt: sortType,
				};
			}

			if (sortBy === 'createdAt') {
				matchObject.$match = {
					$or: [{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
					{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER }],
				};
			}
			else {
				matchObject.$match = {
					'property_status.number': sortBy,
				};
			}

			if (propertyId) { matchObject.$match._id = Types.ObjectId(propertyId); }
			if (propertyType && propertyType !== 3) { matchObject.$match['property_basic_details.property_for_number'] = propertyType; }
			if (type && type !== 'all') { matchObject.$match['property_basic_details.type'] = type; }
			if (bedrooms) { matchObject.$match['property_details.bedrooms'] = bedrooms; }
			if (bathrooms) { matchObject.$match['property_details.bathrooms'] = bathrooms; }
			if (minArea) { matchObject.$match['property_details.floor_area'] = { $gt: minArea }; }
			if (maxArea) { matchObject.$match['property_details.floor_area'] = { $lt: maxArea }; }
			if (minPrice) { matchObject.$match['property_basic_details.sale_rent_price'] = { $gt: minPrice }; }
			if (maxPrice) { matchObject.$match['property_basic_details.sale_rent_price'] = { $lt: maxPrice }; }

			if (label && label[0] !== 'all') {
				label.forEach((item) => {
					matchObject.$match['property_basic_details.label'] = item;
				});
			}

			const query = [
				matchObject,
				searchCriteria,
				{
					$lookup: {
						from: 'regions',
						let: { regionId: '$property_address.region' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$regionId'],
									},
								},
							},
							{
								$project: {
									fullName: 1,
									_id: 1,
								},
							},
						],
						as: 'regionData',
					},
				},
				{
					$lookup: {
						from: 'cities',
						let: { cityId: '$property_address.city' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$cityId'],
									},
								},
							},
							{
								$project: {
									name: 1,
									_id: 1,
								},
							},
						],
						as: 'cityData',
					},
				},
				{
					$unwind: {
						path: '$regionData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						'property_features': 1,
						'updatedAt': 1,
						'createdAt': 1,
						'property_details': 1,
						'property_address.region': '$regionData.fullName',
						'property_address.regionId': '$regionData._id',
						'property_address.city': '$cityData.name',
						'property_address.cityId': '$cityData._id',
						'property_address.address': '$property_address.address',
						'property_address.barangay': '$property_address.barangay',
						'property_address.location': '$property_address.location',
						'propertyId': '$_id',
						'propertyShortId': '$propertyId',
						'property_basic_details': 1,
						'property_added_by': 1,
						'propertyImages': 1,
						'isFeatured': 1,
						'property_status': 1,
					},
				},
				{ $sort: sortingType },
			];
			const propertyList = await this.DAOManager.paginate(this.modelName, query, limit, page);
			return propertyList;
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const PropertyE = new PropertyClass();

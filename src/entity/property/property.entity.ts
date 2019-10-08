import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';
import { PropertyRequest } from '@src/interfaces/property.interface';

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

	async getPropertyList(payload: PropertyRequest.SearchProperty) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea, property_status, fromDate, toDate, property_features, byCity, byRegion } = payload;
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
							{ 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
							// { 'property_added_by.userName': new RegExp('.*' + searchTerm + '.*', 'i') },
							// { 'property_added_by.email': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_basic_details.title': new RegExp('.*' + searchTerm + '.*', 'i') },
							// { 'property_added_by.firstName': new RegExp('.*' + searchTerm + '.*', 'i') },
							// { 'property_added_by.lastName': new RegExp('.*' + searchTerm + '.*', 'i') },
						],
					},
				};
			}
			else {
				searchCriteria = {
					$match: {
					},
				};
			}

			if (sortBy) {
				switch (sortBy) {
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
							isFeatured: sortType,
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
			else if (property_status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
				sortBy = 'approvedAt';
				sortingType = {
					approvedAt: sortType,
				};
			} else {
				sortBy = 'updatedAt';
				sortingType = {
					updatedAt: sortType,
				};
			}

			// List of all properties for admin.
			if (property_status && property_status === Constant.DATABASE.PROPERTY_STATUS.ADMIN_PROPERTIES_LIST.NUMBER) {
				matchObject.$match = {
					$or: [
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER },
					],
				};
			}

			// List of all properties of user.
			if (property_status && property_status === Constant.DATABASE.PROPERTY_STATUS.USER_PROPERTIES_LIST.NUMBER) {
				matchObject.$match = {
					$or: [
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER },
					],
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
			if (byCity) { matchObject.$match['city'] = byCity; }
			if (byRegion) { matchObject.$match['region'] = byRegion; }

			// List of properties acc to specific property status
			if (property_status && !(property_status === Constant.DATABASE.PROPERTY_STATUS.ADMIN_PROPERTIES_LIST.NUMBER)) { matchObject.$match['property_status.number'] = property_status; }
			// Date filters
			if (fromDate && toDate) { matchObject.$match['createdAt'] = { $gte: fromDate, $lte: toDate }; }
			if (fromDate && !toDate) { matchObject.$match['createdAt'] = { $gte: fromDate }; }
			if (!fromDate && toDate) { matchObject.$match['createdAt'] = { $lte: toDate }; }

			if (label && label[0] !== 'all') {
				matchObject.$match = { $or: [] };
				label.forEach((item) => {
					if (item) matchObject.$match.$or.push({ 'property_basic_details.label': item });
				});
			}

			if (property_features && property_features.length > 0) {
				matchObject.$match = { $and: [] };
				property_features.forEach((item) => {
					if (item) {
						const cond = {};
						cond[`property_features.${item}`] = true;
						matchObject.$match.$and.push(cond);
					}
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
	async suggested_property(payload: PropertyRequest.UserProperty) {
		try {
			let { sortType, sortBy, page, limit } = payload;
			const { propertyId } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			sortType = !sortType ? -1 : sortType;
			let sortingType = {};
			const criteria = {
				_id: Types.ObjectId(propertyId),
			};

			const propertyData = await this.DAOManager.findOne(this.modelName, criteria, ['_id', 'property_added_by']);
			if (!propertyData) return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;

			const query = {
				'property_added_by.userId': Types.ObjectId(propertyData.property_added_by.userId),
				'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
				'_id': {
					$ne: Types.ObjectId(payload.propertyId),
				},
			};

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						if (sortType === 1) {
							sortingType = {
								price: -1,
							};
						} else {
							sortingType = {
								isfeatured: 1,
							};
						}
					default:
						sortBy = 'isFeatured';
						sortingType = {
							isFeatured: 1,
						};
						break;
				}
			}
			const pipeline = [
				{
					$match: query,
				}, {
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
			const data = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
			return data;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload
	 * @description Get the list of cities which has maximum number of active properties.
	 */

	async popularCities(payload: PropertyRequest.IPaginate) {
		try {
			let { page, limit } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			const skip = (limit * (page - 1));

			const pipeline = [
				{
					$match: {
						'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
					},
				},
				{
					$project: {
						cityId: '$property_address.city',
						_id: 1,
					},
				},
				{
					$group: {
						_id: '$cityId',
						property: { $push: '$_id' },
					},
				},
				{
					$project: {
						cityId: '$_id',
						propertyCount: { $cond: { if: { $isArray: '$property' }, then: { $size: '$property' }, else: 0 } },
						_id: 0,
					},
				},
				{
					$sort: {
						propertyCount: -1,
					},
				},
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup:
					{
						from: 'cities',
						let: { id: '$cityId' },
						pipeline: [
							{
								$match: {
									$expr:
									{
										$eq: ['$_id', '$$id'],
									},
								},
							},
							{
								$project:
								{
									images: 1,
									name: 1,
								},
							},
						],
						as: 'cityData',
					},
				},
				{
					$unwind: {
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project:
					{
						propertyCount: 1,
						cityId: 1,
						cityImages: '$cityData.images',
						cityName: '$cityData.name',
					},
				},
			];

			const popularCities = await this.DAOManager.aggregateData(this.modelName, pipeline);
			if (!popularCities) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
			return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, popularCities;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export const PropertyE = new PropertyClass();

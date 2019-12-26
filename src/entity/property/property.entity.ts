import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';
import { PropertyRequest } from '@src/interfaces/property.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as mongoose from 'mongoose';

export class PropertyClass extends BaseEntity {
	constructor() {
		super('Property');
	}

	async PropertyList(pipeline) {
		try {
			return await this.DAOManager.paginate(this.modelName, pipeline);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async PropertyByStatus(query) {
		try {
			return await this.DAOManager.paginate(this.modelName, query);
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
					$project: {
						_id: 1,
						property_features: 1,
						updatedAt: 1,
						createdAt: 1,
						property_details: 1,
						property_address: 1,
						approvedAt: 1,
						propertyId: '$_id',
						propertyShortId: '$propertyId',
						property_basic_details: 1,
						property_added_by: 1,
						propertyImages: 1,
						isFeatured: 1,
						isHomePageFeatured: 1,
						property_status: 1,
					},
				},
				{
					$lookup: {
						from: 'subscriptions',
						let: { propertyId: '$_id', userId: '$property_added_by.userId' },
						pipeline: [
							{
								$facet: {
									featuredProperties: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.PROPERTY] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
									homepageFeaturedProperties: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.HOMEPAGE] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
									users: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$userId', '$$userId'] }, { $in: ['$featuredType', [Constant.DATABASE.FEATURED_TYPE.PROFILE, Constant.DATABASE.FEATURED_TYPE.HOMEPAGE]] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
								},
							},
						],
						as: 'subscriptions',
					},
				},
				{
					$addFields: { subscriptions: { $arrayElemAt: ['$subscriptions', 0] } },
				},
				{
					$addFields: {
						'isFeatured': {
							$cond: { if: { $eq: ['$isFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.featuredProperties', []] }, then: false, else: true } } },
						},
						'isHomePageFeatured': {
							$cond: { if: { $eq: ['$isHomePageFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.homepageFeaturedProperties', []] }, then: false, else: true } } },
						},
						'property_added_by.isFeaturedProfile': {
							$cond: { if: { $eq: ['$subscriptions.users', []] }, then: false, else: true },
						},
					},
				},
				{
					$project: {
						subscriptions: 0,
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
			const { searchTerm, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea, property_status, fromDate, toDate, property_features, byCity, byRegion, screenType } = payload;
			const featuredType = (screenType === Constant.DATABASE.SCREEN_TYPE.SEARCH) ? Constant.DATABASE.FEATURED_TYPE.PROPERTY : Constant.DATABASE.FEATURED_TYPE.HOMEPAGE;
			let addFields;
			if (screenType === Constant.DATABASE.SCREEN_TYPE.SEARCH) {
				addFields = {
					'isFeatured': {
						$cond: { if: { $eq: ['$isFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.properties', []] }, then: false, else: true } } },
					},
					'property_added_by.isFeaturedProfile': {
						$cond: { if: { $eq: ['$subscriptions.users', []] }, then: false, else: true },
					},
				};
			} else { // Constant.DATABASE.SCREEN_TYPE.HOMEPAGE
				addFields = {
					'isFeatured': {
						$cond: { if: { $eq: ['$isHomePageFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.properties', []] }, then: false, else: true } } },
					},
					'property_added_by.isFeaturedProfile': {
						$cond: { if: { $eq: ['$subscriptions.users', []] }, then: false, else: true },
					},
				};
			}
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
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
							{ 'property_added_by.firstName': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_added_by.email': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ propertyId: new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_basic_details.title': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_added_by.firstName': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_added_by.lastName': new RegExp('.*' + searchTerm + '.*', 'i') },
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
					case 'price':
						sortBy = 'price';
						sortingType = {
							'property_basic_details.sale_rent_price': sortType,
						};
						break;
					case 'date':
						sortBy = 'date';
						sortingType = {
							updatedAt: sortType,
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
							updatedAt: sortType,
						};
						break;
				}
			} else if (property_status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
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
			if (byCity) { matchObject.$match['cityId'] = byCity; }
			if (byRegion) { matchObject.$match['regionId'] = byRegion; }

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
					$project: {
						_id: 1,
						property_features: 1,
						updatedAt: 1,
						createdAt: 1,
						approvedAt: 1,
						property_details: 1,
						property_address: 1,
						propertyId: '$_id',
						propertyShortId: '$propertyId',
						property_basic_details: 1,
						property_added_by: 1,
						propertyImages: 1,
						isFeatured: 1,
						isHomePageFeatured: 1,
						property_status: 1,
					},
				},
				{
					$lookup: {
						from: 'savedproperties',
						let: { id: '$propertyId' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$propertyId', '$$id'],
									},
								},
							},
							{
								$project: {
									_id: 1,
								},
							},
						],
						as: 'saveProp',
					},
				},
				{
					$addFields: {
						isSaved: {
							$cond: {
								if: {
									$gt: [
										{ $size: '$saveProp' },
										0,
									],
								},
								then: true,
								else: false,
							},
						},
					},
				},
				{
					$project: {
						saveProp: 0,
					},
				},
				{
					$lookup: {
						from: 'subscriptions',
						let: { propertyId: '$_id', userId: '$property_added_by.userId' },
						pipeline: [
							{
								$facet: {
									properties: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', featuredType] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
									users: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$userId', '$$userId'] }, { $in: ['$featuredType', [Constant.DATABASE.FEATURED_TYPE.PROFILE, Constant.DATABASE.FEATURED_TYPE.HOMEPAGE]] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
								},
							},
						],
						as: 'subscriptions',
					},
				},
				{
					$addFields: { subscriptions: { $arrayElemAt: ['$subscriptions', 0] } },
				},
				{ $addFields: addFields },
				{
					$project: {
						subscriptions: 0,
					},
				},
				{ $sort: sortingType },
			];
			return await this.DAOManager.paginate(this.modelName, query, limit, page);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async suggested_property(payload: PropertyRequest.UserProperty) {
		try {
			let { sortType, sortBy, page, limit, userId } = payload;
			const { propertyId } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			sortType = !sortType ? -1 : sortType;
			let sortingType = {};
			let query;
			if (!userId) {
				const criteria = {
					_id: Types.ObjectId(propertyId),
				};
				const propertyData = await this.DAOManager.findOne(this.modelName, criteria, ['_id', 'property_added_by']);
				if (!propertyData) return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;
				userId = propertyData.property_added_by.userId;
			}

			if (payload.propertyFor) {
				query = {
					'property_added_by.userId': Types.ObjectId(userId),
					'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
					'_id': {
						$ne: Types.ObjectId(payload.propertyId),
					},
					'property_basic_details.property_for_number': payload.propertyFor,
				};
			}

			else if (payload.propertyType === Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER) {
				query = {
					'property_added_by.userId': Types.ObjectId(userId),
					'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
					'_id': {
						$ne: Types.ObjectId(payload.propertyId),
					},
				};
			}
			else {
				query = {
					'property_added_by.userId': Types.ObjectId(userId),
					'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
					'property_for.number': payload.propertyFor,
					'_id': {
						$ne: Types.ObjectId(payload.propertyId),
					},
				};
			}

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						if (sortType === 1) {
							sortingType = {
								'property_basic_details.sale_rent_price': -1,
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
			} else {
				sortBy = 'isFeatured';
				sortingType = {
					isFeatured: 1,
				};
			}
			const pipeline = [
				{
					$match: query,
				},
				{
					$project: {
						_id: 1,
						property_features: 1,
						updatedAt: 1,
						createdAt: 1,
						approvedAt: 1,
						property_details: 1,
						property_address: 1,
						propertyId: '$_id',
						propertyShortId: '$propertyId',
						property_basic_details: 1,
						property_added_by: 1,
						propertyImages: 1,
						isFeatured: 1,
						property_status: 1,
					},
				},
				{
					$lookup: {
						from: 'savedproperties',
						let: { id: '$propertyId' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$propertyId', '$$id'],
									},
								},
							},
							{
								$project: {
									_id: 1,
								},
							},
						],
						as: 'saveProp',
					},
				},
				{
					$addFields: {
						isSaved: {
							$cond: {
								if: {
									$gt: [
										{ $size: '$saveProp' },
										0,
									],
								},
								then: true,
								else: false,
							},
						},
					},
				},
				{
					$project: {
						saveProp: 0,
					},
				},
				{
					$lookup: {
						from: 'subscriptions',
						let: { propertyId: '$_id', userId: '$property_added_by.userId' },
						pipeline: [
							{
								$facet: {
									properties: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.PROPERTY] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
									users: [
										{
											$match: {
												$expr: {
													$and: [{ $eq: ['$userId', '$$userId'] }, { $in: ['$featuredType', [Constant.DATABASE.FEATURED_TYPE.PROFILE, Constant.DATABASE.FEATURED_TYPE.HOMEPAGE]] }],
												},
											},
										},
										{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
										{ $project: { _id: 1 } },
									],
								},
							},
						],
						as: 'subscriptions',
					},
				},
				{
					$addFields: { subscriptions: { $arrayElemAt: ['$subscriptions', 0] } },
				},
				{
					$addFields: {
						'isFeatured': {
							$cond: { if: { $eq: ['$isFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.properties', []] }, then: false, else: true } } },
						},
						'property_added_by.isFeaturedProfile': {
							$cond: { if: { $eq: ['$subscriptions.users', []] }, then: false, else: true },
						},
					},
				},
				{
					$project: {
						subscriptions: 0,
					},
				},
				{ $sort: sortingType },
			];
			return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);

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
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			const skip = (limit * (page - 1));

			const pipeline = [
				{
					$match: {
						'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
						'property_basic_details.property_for_number': payload.propertyType,
					},
				},
				{
					$project: {
						cityId: '$property_address.cityId',
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
			return popularCities;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload
	 */

	async getPropertyViaCity(payload: UserRequest.RecentProperty) {
		try {
			const promiseArray = [];
			let latestProperty, agents, featuredCity;
			let { sortType, sortBy, page, limit } = payload;
			let sortingType: any = {};
			const { cityId, All, propertyType, propertyFor } = payload;
			let query: any = {};
			sortType = !sortType ? -1 : sortType;
			if (!limit) { limit = 4; }
			if (!page) { page = 1; }
			const skip = (limit * (page - 1));
			sortingType = {
				approvedAt: sortType,
			};
			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						sortingType = {
							'property_basic_details.sale_rent_price': sortType,
						};
						break;
					default:
						sortingType = {
							createdAt: sortType,
						};
				}
			}

			query = {
				'property_address.cityId': mongoose.Types.ObjectId(cityId),
				'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
			};
			promiseArray.push(this.DAOManager.findAll(this.modelName, query, { propertyActions: 0 }, { limit, skip, sort: sortingType }));
			const agentQuery = {
				type: 'AGENT',
				serviceAreas: { $in: [mongoose.Types.ObjectId(cityId)] },
				// isFeaturedProfile: true,
			};

			const query1 = [
				{ $match: agentQuery },
				{ $sort: sortingType },
				{ $skip: skip },
				{ $limit: limit },
				{
					$unwind: {
						path: '$serviceAreas',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$lookup: {
						from: 'cities',
						let: { cityId },
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
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: '$_id',
						firstName: { $first: '$firstName' },
						userName: { $first: '$userName' },
						email: { $first: '$email' },
						middleName: { $first: '$middleName' },
						createdAt: { $first: '$createdAt' },
						phoneNumber: { $first: '$phoneNumber' },
						type: { $first: '$type' },
						title: { $first: '$title' },
						license: { $first: '$license' },
						taxNumber: { $first: '$taxNumber' },
						faxNumber: { $first: '$faxNumber' },
						companyName: { $first: '$companyName' },
						address: { $first: '$address' },
						aboutMe: { $first: '$aboutMe' },
						profilePicUrl: { $first: '$profilePicUrl' },
						backGroundImageUrl: { $first: '$backGroundImageUrl' },
						specializingIn_property_type: { $first: '$specializingIn_property_type' },
						specializingIn_property_category: { $first: '$specializingIn_property_category' },
						isFeaturedProfile: { $first: '$isFeaturedProfile' },
						lastName: { $first: '$lastName' },
						city: {
							$push: {
								cityId: '$cityData._id',
								cityName: '$cityData.name',
							},
						},
					},
				},
			];
			promiseArray.push(this.DAOManager.paginate('User', query1, limit, page));
			promiseArray.push(this.DAOManager.findOne('City', { _id: cityId }, {}, {}));
			[latestProperty, agents, featuredCity] = await Promise.all(promiseArray);

			return {
				latestProperty,
				agents: agents['data'],
				featuredCity,
			};
		}
		catch (error) {
			return Promise.reject(error);
		}
	}
}

export const PropertyE = new PropertyClass();

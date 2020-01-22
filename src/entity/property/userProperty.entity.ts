import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants/app.constant';
import { PropertyRequest } from '@src/interfaces/property.interface';
import * as utils from '@src/utils';
import { Types } from 'mongoose';

export class UserPropertyClass extends BaseEntity {
	constructor() {
		super('Property');
	}
	async getUserPropertyList(payload: PropertyRequest.PropertyByStatus, userData) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm } = payload;
			const propertyType = payload.propertyType;
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			let sortingType = {};
			let searchCriteria: any = {};
			sortType = !sortType ? -1 : sortType;
			let criteria;
			sortingType = {
				updatedAt: sortType,
			};
			if (searchTerm) {
				searchCriteria = {
					$match: {
						$or: [
							{ 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_basic_details.title': new RegExp('.*' + searchTerm + '.*', 'i') },
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
						sortBy = 'updatedAt';
						sortingType = {
							updatedAt: sortType,
						};
						break;
				}
			}

			if (propertyType === Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER) {
				criteria = {
					$match: {
						$and: [{
							userId: userData._id,
						}, {
							$or: [
								{
									isFeatured: true,
								}, {
									isHomePageFeatured: true,
								},
							],
						},
						],
					},
				};
			}
			else if (propertyType !== Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER) {
				criteria = {
					$match: {
						'property_added_by.userId': new Types.ObjectId(userData._id),
						'property_status.number': propertyType,
					},
				};
			}

			const pipeline = [
				criteria,
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
				{ $sort: sortingType },
				{
					$lookup: {
						from: 'subscriptions',
						let: { propertyId: '$_id', userId: '$property_added_by.userId' },
						pipeline: [{
							$match: {
								$expr: {
									$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }],
								},
							},
						}, {
							$project: {
								_id: 1,
								featuredType: 1,
							},
						},
						],
						as: 'subscriptionData',
					}
				},
				{
					$unwind: {
						path: '$subscriptionData',
						preserveNullAndEmptyArrays: true,
					},
				},

				// 	{
				//         $lookup: {
				//             from: 'properties',
				//             let: { propertyId: '$propertyId' },
				//             pipeline: [
				//                 {
				//                     $match: {
				//                         $expr: {
				//                             $and: [
				//                                 { $eq: ['$_id', '$$propertyId'] },
				//                                 { $eq: ['$property_status.number', Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER] },
				//                             ],
				//                         },
				//                     },
				//                 },
				//                 { $project: { propertyActions: 0 } },
				//             ],
				//             as: 'propertyData',
				//         },
				//     },
				//     {
				//         $match: {
				//             $expr: { $gt: [{ $size: '$propertyData' }, 0] },
				//         },
				//     },
				//     {
				//         $unwind: {
				//             path: '$propertyData',
				//             preserveNullAndEmptyArrays: true,
				//         },
				//     },
				//     { $replaceRoot: { newRoot: '$propertyData' } },
				//     { $sort: sortingType },
				// ];



				// 			{
				// 				$facet: {
				// 					featuredProperties: [
				// 						{
				// 							$match: {
				// 								$expr: {
				// 									$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.PROPERTY] }],
				// 								},
				// 							},
				// 						},
				// 						{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
				// 						{ $project: { _id: 1 } },
				// 					],
				// 					homepageFeaturedProperties: [
				// 						{
				// 							$match: {
				// 								$expr: {
				// 									$and: [{ $eq: ['$propertyId', '$$propertyId'] }, { $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.HOMEPAGE] }],
				// 								},
				// 							},
				// 						},
				// 						{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
				// 						{ $project: { _id: 1 } },
				// 					],
				// 					users: [
				// 						{
				// 							$match: {
				// 								$expr: {
				// 									$and: [{ $eq: ['$userId', '$$userId'] }, { $in: ['$featuredType', [Constant.DATABASE.FEATURED_TYPE.PROFILE, Constant.DATABASE.FEATURED_TYPE.HOMEPAGE]] }],
				// 								},
				// 							},
				// 						},
				// 						{ $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
				// 						{ $project: { _id: 1 } },
				// 					],
				// 				},
				// 			},
				// 		],
				// 		as: 'subscriptions',
				// 	},
				// },
				// {
				// 	$addFields: { subscriptions: { $arrayElemAt: ['$subscriptions', 0] } },
				// },
				// {
				// 	$addFields: {
				// 		'isFeatured': {
				// 			$cond: { if: { $eq: ['$isFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.featuredProperties', []] }, then: false, else: true } } },
				// 		},
				// 		'isHomePageFeatured': {
				// 			$cond: { if: { $eq: ['$isHomePageFeatured', false] }, then: false, else: { $cond: { if: { $eq: ['$subscriptions.homepageFeaturedProperties', []] }, then: false, else: true } } },
				// 		},
				// 		'property_added_by.isFeaturedProfile': {
				// 			$cond: { if: { $eq: ['$subscriptions.users', []] }, then: false, else: true },
				// 		},
				// 	},
				// },
				// {
				// 	$project: {
				// 		subscriptions: 0,
				// 	},
				// },
			];
			return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateFeaturedPropertyStatus(payload: PropertyRequest.PropertyData) {
		try {
			const query: any = {};
			query._id = payload.propertyId;
			const set: any = {};
			const update = {};
			update['$set'] = set;
			if (payload.isFeatured) {
				set.isFeatured = true;
			}
			if (payload.isHomePageFeatured) {
				set.isHomePageFeatured = true;
			}

			return await this.DAOManager.findAndUpdate(this.modelName, query, update);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}
}
export const UserPropertyE = new UserPropertyClass();

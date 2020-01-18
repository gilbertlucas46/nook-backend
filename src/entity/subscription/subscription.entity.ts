'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { SubscriptionRequest } from '@src/interfaces/subscription.interface';
import { Types } from 'mongoose';

export class SubscriptionClass extends BaseEntity {

	constructor() {
		super('Subscription');
	}

	async checkSubscriptionExist(payload: SubscriptionRequest.Get) {
		try {
			const query: any = {};
			query.userId = payload.userId;
			query.featuredType = payload.featuredType;
			query.status = 'active';
			// query['$and'] = [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }];
			// query.propertyId = { $exists: false };
			return await this.DAOManager.findOne(this.modelName, query, {});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async getAllHomepageSubscritions(payload: SubscriptionRequest.Get) {
		try {
			const query: any = {};
			query.userId = payload.userId;
			query.featuredType = Constant.DATABASE.FEATURED_TYPE.HOMEPAGE;
			query['$and'] = [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }];
			const projection = { _id: 1, endDate: 1 };
			const sort = { endDate: -1 };
			const response = await this.DAOManager.findAllWithSort(this.modelName, query, projection, sort);
			return response.length ? response : [];
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async addSubscrition(payload: SubscriptionRequest.Add) {
		try {
			return await this.DAOManager.saveData(this.modelName, {
				featuredType: payload.featuredType,
				subscriptionType: payload.subscriptionType,
				userId: payload.userId,
				startDate: new Date().getTime(),
				endDate: payload.subscriptionType === Constant.DATABASE.BILLING_TYPE.MONTHLY ? new Date().getTime() + 30 * 24 * 60 * 60 * 1000 : new Date().getTime() + 365 * 24 * 60 * 60 * 1000,
			});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async assignPropertyWithSubscription(payload) {
		try {
			const query: any = {};
			query._id = payload.subscriptionId;
			const update = {};
			update['$set'] = {
				propertyId: payload.propertyId,
			};

			return await this.DAOManager.findAndUpdate(this.modelName, query, update);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async checkFeaturePropertyCount(userData) {
		try {
			// const query: any = {};
			// query.userId = userData._id;
			// query.featuredType = Constant.DATABASE.FEATURED_TYPE.PROPERTY;
			// query.status = 'active';
			// query['$and'] = [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }];
			// query.propertyId = { $exists: false };
			//   return await this.DAOManager.count();
			const query = {
				'isFeatured': true,
				'property_added_by.userId': userData._id,
				'property_status.number': 2,
			};

			const data = await this.DAOManager.count('Property', query);

			return {
				featurePropertyCount: data,
			};
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async getUserDashboard(payload, userData) {
		try {
			let { page, limit, sortType } = payload;

			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			sortingType = {
				updatedAt: -1,
			};
			const pipeline = [
				{
					$match: {
						$and: [
							{
								status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
								userId: userData._id,
							},
							// {
							// 	$or: [{
							// 		featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY,
							// 	}, {
							// 		featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
							// 	}],
							// },
						],
					},
				},
				{
					$project: {
						_id: 1,
						propertyId: 1,
						featuredType: 1,
						subscriptionType: 1,
						status: 1,
						isRecurring: 1,
						paymentMethod: 1,
						amount: 1,
						userId: 1,
						createdAt: 1,
						updatedAt: 1,
						endDate: 1,
						startDate: 1,
					},
				},
				{
					$lookup: {
						from: 'properties',
						let: { propertyId: '$propertyId' },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [{ $eq: ['$_id', '$$propertyId'] }, { $eq: ['$property_status.number', 3] }],
									},
								},
							},
							{
								$project: {
									_id: 1,
									isFeatured: 1,
									isHomePageFeatured: 1,
									title: '$property_basic_details.title',
									name: '$property_basic_details.name',
									propertyId: '$property',
								},
							},
						],
						as: 'propertyData',
					},
				},
				{
					$unwind: {
						path: '$propertyData',
						preserveNullAndEmptyArrays: true,

					},
				},
				{ $sort: sortingType },
			];

			const data = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
			return data;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async activeSubscriptionList(userData, payload) {
		try {
			const {
				sortBy = 'date',
				page = 1,
				sortType = -1,
				limit = Constant.SERVER.LIMIT,
			} = payload;

			const paginateOptions = {
				page, limit,
			};
			let sortingType = {};
			let query: any = {};
			sortingType = {
				createdAt: sortType,
			};

			query = {
				userId: userData._id,
				status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
				$or: [
					{
						featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY,
					}, {
						featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
					}],
			};

			// query['$or'] = [
			// 	{
			// 		featuredType: Constant.DATABASE.FEATURED_TYPE.PROFILE,
			// 	}, {
			// 		featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE,
			// 	}
			// ]
			const matchPipeline = [
				{ $match: query },
				{ $sort: sortingType },
			];
			// const pipeline = [
			// 	{ $match: query },
			// 	{ $sort: sortingType },
			// ];


			const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
			// const data = await ENTITY.SubscriptionE.paginate(pipeline, {});
			console.log('>>>>>>>>>>>>>>>>>>>.', data);
			return data;
			// {
			// 	$match: {
			// 		$and: [
			// 			{
			// 				userId: userData._id,
			// 				status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
			// 				// endDate: { $gt: new Date().getTime() },
			// 			},
			// 			// {
			// 			// 	$or: [{
			// 			// 		featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY,
			// 			// 	}, {
			// 			// 		featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
			// 			// 	}],
			// 			// },
			// 		],
			// 	},
			// }];
		} catch (error) {
			return Promise.reject(error);
		}
	}


	async updateSubscriptionStatus(paymentIntent) {
		try {
			// const data = await this.DAOManager()
			// console.log('data>>>>>>>>>>>>>>>>>>>>>', data);
			// return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

}

export const SubscriptionE = new SubscriptionClass();
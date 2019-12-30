'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { SubscriptionRequest } from '@src/interfaces/subscription.interface';

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
}

export const SubscriptionE = new SubscriptionClass();
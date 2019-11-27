'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { SubscriptionRequest } from '@src/interfaces/subscription.interface';

export class SubscriptionClass extends BaseEntity {

	constructor() {
		super('Subscription');
	}

	async getSubscrition(payload: SubscriptionRequest.Get) {
		try {
			const query: any = {};
			query.userId = payload.userId;
			query.featuredType = { $in: payload.featuredType };
			query['$and'] = [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }];
			if (payload.propertyId) {
				query.propertyId = { $exists: false };
			}
			return await this.DAOManager.findOne(this.modelName, query, {});
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
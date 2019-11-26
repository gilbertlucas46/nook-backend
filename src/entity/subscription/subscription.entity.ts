'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { SubscriptionRequest } from '@src/interfaces/subscription.interface';

export class SubscriptionClass extends BaseEntity {

	constructor() {
		super('Subscription');
	}

	async addSubscrition(payload: SubscriptionRequest.Add) {
		try {
			return await this.DAOManager.saveData(this.modelName, {
				featuredType: payload.featuredType,
				userId: payload.userId,
				startDate: new Date().getTime(),
				endDate: payload.billingType === Constant.DATABASE.BILLING_TYPE.MONTHLY ? new Date().getTime() + 30 * 24 * 60 * 60 * 1000 : new Date().getTime() + 365 * 24 * 60 * 60 * 1000
			});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}
}

export const SubscriptionE = new SubscriptionClass();
import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';
import * as ENTITY from '../../entity';
import { formatUserData } from '@src/utils';
import { stripeService } from '../../lib';

class SubscriptionController {
	t

	async subscriptionList(payload) {
		try {
			return Constant.DATABASE.SUBSCRIPTION_TYPE(payload.type);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async activeSubscriptionList(userData) {
		try {
			const pipeline = [
				{
					$match: {
						$and: [
							{
								userId: userData._id,
								status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
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
				}];
			const data = await ENTITY.SubscriptionE.aggregate(pipeline, {});
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async userDashboard(payload, userData) {
		try {
			const data = await ENTITY.SubscriptionE.getUserDashboard(payload, userData);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async cancelSubscription(payload, userData) {
		try {
			const userSubscriptionData = await ENTITY.SubscriptionE.getOneEntity({ _id: payload.id, userId: userData._id }, { subscriptionId: 1, status: 1 });
			if (userSubscriptionData['status'] !== Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				return Promise.reject('already not in active status');
			}
			const stripeData = await stripeService.updateSubscription(userSubscriptionData);
			return;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async userSubscriptionProperty(userData, payload) {
		try {
			return await ENTITY.SubscriptionE.activeSubscriptionList(userData, payload);
		} catch (error) {
			return Promise.reject(error);

		}
	}
}

export const subscriptionController = new SubscriptionController();
import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';
import * as ENTITY from '../../entity';
import { formatUserData } from '@src/utils';
import { stripeService } from '../../lib';

class SubscriptionController {

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
			// const criteria = {
			// 	userId: userData._id,
			// 	status: 'active',

			const pipeline = [
				{
					$match: {
						$and: [
							{
								userId: userData._id,
								status: 'active',
								// endDate: { $gt: new Date().getTime() },
							}, {
								$or: [{
									featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY,
								}, {
									featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY,
								}],
							},
						],
					},
				}];
			const data = await ENTITY.SubscriptionE.aggregate(pipeline, {});
			console.log('datadatadatadata', data);
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
			console.log('>?>>>>>>>>>>>..');

			const userSubscriptionData = await ENTITY.SubscriptionE.getOneEntity({ _id: payload.id, userId: userData._id }, { subscriptionId: 1, status: 1 })
			console.log('userSubscriptionIduserSubscriptionIduserSubscriptionId', userSubscriptionData);
			if (userSubscriptionData['status'] !== Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				return Constant.STATUS_MSG.ERROR.E401.SUBSCRIPTION_INACTIVE;
			}
			console.log('userSubscriptionIduserSubscriptionId', userSubscriptionData['subscriptionId']);
			const stripeData = await stripeService.updateSubscription(userSubscriptionData);
			console.log('stripeDatastripeDatastripeData', stripeData);

			return await ENTITY.SubscriptionE.updateOneEntity({ _id: payload.id }, { $set: { status: Constant.DATABASE.SUBSCRIPTION_STATUS.CANCEL } });

		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const subscriptionController = new SubscriptionController();
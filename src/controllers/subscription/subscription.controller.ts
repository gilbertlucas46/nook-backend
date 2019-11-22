import * as Constant from '@src/constants/app.constant';

class SubscriptionController {

	async subscriptionList(payload) {
		try {
			return Constant.DATABASE.SUBSCRIPTION_TYPE(payload.type);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const subscriptionController = new SubscriptionController();
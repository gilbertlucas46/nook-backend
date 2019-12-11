import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils';

class SubscriptionController {

	async subscriptionList(payload) {
		try {
			return Constant.DATABASE.SUBSCRIPTION_TYPE(payload.type);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export const subscriptionController = new SubscriptionController();
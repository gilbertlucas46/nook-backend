import * as Stripe from 'stripe';

import * as Constant from '@src/constants/app.constant';
import * as config from 'config';
import * as utils from '../utils';

const stripe = new Stripe(config.get('stripeSecretKey'));

export class StripeManager {
	// private stripeKey: string = config.get('MAIL_FROM_ADDRESS')

	async createCustomers(payload) {
		try {
			return await stripe.customers.create(payload);
		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			return Promise.reject(error);
		}
	}

	async createCustomersSource(customerId: string, cardToken: string) {
		try {
			return await stripe.customers.createSource(customerId, { source: cardToken });
		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			return Promise.reject(error);
		}
	}

	async deleteCustomersSource(customerId: string, cardToken: string) {
		try {
			return await stripe.customers.deleteSource(customerId, cardToken);
		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			return Promise.reject(error);
		}
	}

	async createCharges(payload) {
		try {
			return await stripe.charges.create(payload);
		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			error.message = Constant.STATUS_MSG.ERROR.E400.PAYMENT_ERROR.message;
			return Promise.reject(error);
		}
	}

	async createTokens() {
		try {
			return await stripe.tokens.create({
				card: {
					number: '4242424242424242',
					exp_month: 11,
					exp_year: 2020,
					cvc: '314',
				},
			});
		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			error.message = Constant.STATUS_MSG.ERROR.E400.PAYMENT_ERROR.message;
			return Promise.reject(error);
		}
	}
}
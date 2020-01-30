import * as Stripe from 'stripe';
import * as Constant from '@src/constants/app.constant';
import * as config from 'config';
import * as utils from '../utils';
import { deflateRaw } from 'zlib';

const stripe = new Stripe(config.get('stripeSecretKey'));

export class StripeManager {
	async createCustomers(userData, payload) {
		try {
			return await stripe.customers.create({
				email: userData.email,
				// source: payload.source,

				// { description: payload.email },
			});
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

	// async createTokens() {
	// 	try {
	// 		await stripe.tokens.create(
	// 			card: {
	// 				number: '4242424242424242',
	// 				exp_month: 11,
	// 				exp_year: 2020,
	// 				cvc: '314',
	// 			},
	// 		);
	// 	} catch (error) {
	// 		utils.consolelog('StripeManager', error, false);
	// 		error.message = Constant.STATUS_MSG.ERROR.E400.PAYMENT_ERROR.message;
	// 		return Promise.reject(error);
	// 	}
	// }

	async createSubscription(id: string, payload: any) {
		try {
			const data = await stripe.subscriptions.create(
				{
					customer: id,
					items: [{ plan: payload.planId }],
					// cancel_at_period_end: payload.cancel_at_period_end,
				},
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	// async createSubscriptionalRecurring(userData, payload) {
	// 	try {
	// 		const data = await stripe.subscriptions.create(
	// 			{
	// 				customer: userData.stripeId,
	// 				items: [{ plan: payload.planId }],
	// 				cancel_at_period_end: payload.cancel_at_period_end,
	// 			},
	// 		);
	// 		console.log('createSubscriptioncreateSubscriptioncreateSubscription', data);
	// 		return data;
	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	}
	// }

	async createCard(customerId, payload) {
		try {
			const data = await stripe.customers.createSource(
				customerId,
				{ source: payload.source },
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createCard2(createCustomer, payload) {
		try {
			const data = await stripe.customers.createSource(
				createCustomer.stripeId,
				{ source: payload.source },
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getfingerPrint(userData, payload) {
		try {
			const data = await stripe.tokens.retrieve(
				// userData.stripeId,
				payload.source ,
			);
			return data;
		} catch (error) {
			console.log('errorerrorerrorerror', error);
			return Promise.reject(error);
		}
	}

	async getPlanInfo(payload) {
		try {
			const data = await stripe.plans.retrieve(
				payload.planId,
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getPlanList() {
		try {
			const data = await stripe.plans.list(
				{
					limit: 6,
				});
			return data;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async deletePlan(planId: string) {
		try {
			const data = await stripe.plans.del(planId);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createPlan(payload) {
		try {
			const data = await stripe.plans.create(payload);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * 
	 * @param payload Updata customer card
	 */
	async setDefaultCard(getStripeId, payload) {
		try {

			const data = await stripe.customers.update(
				getStripeId['stripeId'],
				// { metadata: { order_id: '6735' } },
				{ metadata: { default_source: payload.source } } , // fingerprint['card']['id'] },
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async updateSubscription(userSubscriptionData) {
		try {
			const data = await stripe.subscriptions.update(
				userSubscriptionData['subscriptionId'],
				// { metadata: { cancel_at_period_end: true } } ,
				{ cancel_at_period_end: true }  ,
			);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const stripeService = new StripeManager();
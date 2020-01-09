import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { stripeService } from '@src/lib/stripe.manager';
// import * as Stripe from 'stripe';

import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils';

class TransactionController extends BaseEntity {

	async createCharge(payload: TransactionRequest.CreateCharge, userData) {
		try {
			// const { featuredType, billingType } = payload;

			// const pipeline = [
			// 	{
			// 		$match: {
			// 			'featuredType': featuredType,
			// 			'plans.billingType': billingType,
			// 		},
			// 	},
			// 	{
			// 		$project: {
			// 			plans: {
			// 				$filter: {
			// 					input: '$plans',
			// 					as: 'plans',
			// 					cond: { $eq: ['$$plans.billingType', billingType] },
			// 				},
			// 			},
			// 		},
			// 	},
			// 	{
			// 		$unwind: {
			// 			path: '$plans',
			// 		},
			// 	},
			// 	{
			// 		$project: {
			// 			amount: '$plans.amount',
			// 		},
			// 	},
			// ];
			// console.log('pipelinepipelinepipeline', pipeline);

			// const amount = await ENTITY.SubscriptionPlanEntity.findAmount(pipeline);
			// console.log('amountamountamountamount>>>>>>>>>>>>', amount);

			// const step1 = await stripeManager.createCharges({
			// 	// amount: payload.amount * (0.01967 * 100),
			// 	amount: amount * 100,
			// 	currency: payload.currency,
			// 	source: payload.source,
			// 	description: payload.description,
			// });
			// console.log('step1step1step1', step1);
			// payload['amount'] = amount;
			// const step2 = await ENTITY.TransactionE.addTransaction(payload, userData, step1);
			console.log('payloadpayloadpayloadpayloadpayloadpayload', payload);

			const getUserCriteria = {
				_id: userData._id,
			};
			const criteria = {
				userId: userData._id,
			};
			const CheckplaninDb = {
				'plans.planId': payload.planId,
			};
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
			console.log('checkplancheckplancheckplan', checkplan);

			if (!checkplan) {
				return Promise.reject('not in Db');
			}
			const getStripeId = await ENTITY.UserE.getOneEntity(getUserCriteria, { stripeId: 1, email: 1 });
			console.log('getStripeIdgetStripeIdgetStripeId', getStripeId);

			const dataToSet: any = {};
			// if (!getStripeId.stripeId) {
			const createCustomer = await stripeService.createCustomers(getStripeId, payload);
			await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { stripeId: createCustomer.id });

			const createCard = await stripeService.createCard(createCustomer, payload);
			console.log('createCardcreateCardcreateCard', createCard);
			const dataToSave = {
				userId: userData._id,
				cardDetail: createCard,
			};
			const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);
			// const planInfo = await stripeService.getPlanInfo(payload);
			const createSubscript = await stripeService.createSubscription(createCustomer['id'], payload);
			console.log('createSubscriptcreateSubscript', createSubscript);
			return;
			// }
			// return {};
			// const checkUserInStripe = await stripeManager.createCustomers()
		}

		catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async invoiceList(payload: TransactionRequest.InvoiceList, userData) {
		try {
			return await ENTITY.TransactionE.invoiceList(payload, userData);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	// async invoiceDetails(payload: TransactionRequest.Id) {
	// 	try {
	// 		return await ENTITY.TransactionE.invoiceDetails(payload);
	// 	} catch (error) {
	// 		utils.consolelog('error', error, true);
	// 		return Promise.reject(error);
	// 	}
	// }

	// async handleChargeSucceeded(transactioData, paymentIntent) {
	// 	if (!transactioData.subscriptionId) {
	// 		const payload: any = {
	// 			featuredType: transactioData.featuredType,
	// 			subscriptionType: transactioData.billingType,
	// 			userId: transactioData.userId,
	// 		};
	// 		const step1 = await ENTITY.SubscriptionE.addSubscrition(payload);
	// 		transactioData.subscriptionId = step1._id;
	// 	}
	// 	const step2 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
	// 	return {};
	// }

	// async handleChargePending(transactioData, paymentIntent) {
	// 	await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
	// 	return {};
	// }

	// async handleChargeFailed(transactioData, paymentIntent) {
	// 	await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
	// 	return {};
	// }

	async createInvoice(event) {
		try {

			const CheckplaninDb = {
				'plans.planId': event['data']['object']['lines']['data'][0]['plan']['id'],
			};
			const criteria = {
				stripeId: event['data']['object']['customer'],
			};
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {})

			const userData = await ENTITY.UserE.getOneEntity(criteria, { _id: 1 });
			console.log('userDatauserData', userData);

			const step2 = await ENTITY.TransactionE.addTransaction(event, userData, checkplan);
			console.log('step2>>>>>>>>>>>>>>>>>>>', step2);

		} catch (error) {
			return Promise.reject(error);
		}
	}

	// async updateSubscriptionStatus(paymentIntent) {
	// 	//  if(paymentIntent.status==='active')
	// 	// await ENTITY.SubscriptionE.updateSubscriptionStatus(paymentIntent)

	// 	// await ENTITY.WebhookE.createOneEntity()
	// 	const getUser = {
	// 		stripeId: paymentIntent['customer'],
	// 	};
	// 	const getUserInfo = await ENTITY.UserE.getOneEntity(getUser, {});
	// 	console.log('getUserInfogetUserInfogetUserInfo', getUserInfo);

	// 	// console.log('getUserInfogetUserInfogetUserInfo', getUserInfo);

	// 	// const getUserInfo()
	// 	// await ENTITY.SubscriptionE
	// }

	async createSubscription(subscriptionData) {
		try {
			const userData = await ENTITY.UserE.getOneEntity({ stripeId: subscriptionData['data']['object']['customer'] }, { _id: 1 });
			const CheckplaninDb = {
				'plans.planId': subscriptionData['data']['object']['plan']['id'],
			};
			// if (subscriptionData.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
			console.log('checkplancheckplancheckplan', checkplan);
			// }
			const insertData = {
				featuredType: checkplan.featuredType, // createSubscript['plan']['nickname'].replace(/_YEARLY|_MONTHLY/gi, ''), // step2.name,
				subscriptionType: subscriptionData['plan']['interval'],  // subscriptionData['plan']['interval'],
				userId: userData['_id'],
				startDate: new Date().getTime(),
				endDate: (subscriptionData['data']['object']['current_period_end'] * 1000), // new Date().setFullYear(new Date().getFullYear() + 1),
				current_period_start: (subscriptionData['data']['object']['current_period_start'] * 1000),
				status: subscriptionData['data']['object']['status'],
				isRecurring: subscriptionData['data']['object']['cancel_at_period_end'],
				// paymentMethod: createCard['brand'],
				amount: subscriptionData['plan']['amount'],
				subscriptionId: subscriptionData['data']['object']['id'],
				planId: subscriptionData['data']['object']['plan']['id'],
			};
			console.log('insertDatainsertDatainsertData', insertData);
			const step3 = await ENTITY.SubscriptionE.createOneEntity(insertData);

			if (step3.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				if (checkplan['featuredType'] === 'HOMEPAGE_PROFILE') {
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>@2222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: true });
				}
				if (checkplan['featuredType'] === 'PROFILE') {
					console.log('22222222222222222222222222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isFeaturedProfile: true });
				}
				// const step2 = await ENTITY.TransactionE.addTransaction(payload, userData, createSubscript, checkplan, createCard['brand']);
				return;
			}
			// const step2 = await ENTITY.TransactionE.addTransaction(subscriptionData, userData, checkplan);
			// console.log('step2>>>>>>>>>>>>>>>>>>>', step2);
			return;
		} catch (error) {
			return Promise.reject(error);
		}
	}


	async webhook(payload) {
		// const step1 = await ENTITY.TransactionE.findTransactionById({ transactionId: payload.data.object.balance_transaction });
		// console.log('step1step1step1step1step1step1step1step1step1step1', step1);

		// const step2 = await ENTITY.WebhookE.addWebhook({ transactionId: step1._id, webhookObject: payload });
		const addWebhook = await ENTITY.WebhookE.createOneEntity({ webhookObject: payload });
		console.log('addWebhookaddWebhook>>>>>>>>>>>>>>>>>>>>>>', addWebhook);
		try {
			const event = payload;
			const paymentIntent = event.data.object;
			console.log('paymentIntentpaymentIntentpaymentIntent', paymentIntent);
			console.log('jSON STRINFIFYoBJECT>>>>>>>>>>>>>>>>>>>>>>>>>>>', JSON.stringify(event));
			// Handle the event
			switch (event.type) {
				case 'charge.succeeded':
					console.log(1);

					// await this.handleChargeSucceeded(step1, paymentIntent);
					break;
				case 'charge.pending':
					console.log(2);

					// await this.handleChargePending(step1, paymentIntent);
					break;
				case 'charge.failed':
					console.log(3);

					// await this.handleChargeFailed(step1, paymentIntent);
					break;
				case 'charge.failed':
					console.log(4);

					// await this.handleChargeFailed(step1, paymentIntent);
					break;

				case 'customer.subscription.trial_will_end':
					console.log(5);

					// await
					console.log('1111111111111');

					break;
				case 'customer.subscription.deleted':
					console.log(6);

					break;

				case 'customer.subscription.updated':
					console.log('77777777777777777777777777777777');
					// await this.updateSubscriptionStatus(paymentIntent);

					break;

				case 'customer.subscription.created':
					console.log('8888888888888888888888888888888888888888');
					await this.createSubscription(event);
					break;

				case 'invoice.payment_succeeded':
					console.log('9999999999999999999999999');
					await this.createInvoice(event);
			}
			return {};

		} catch (error) {
			utils.consolelog('error', error, true);
			error.message = Constant.STATUS_MSG.ERROR.E400.WEBHOOK_ERROR(error).message;
			return Promise.reject(error);
		}
	}
}

export const transactionController = new TransactionController();
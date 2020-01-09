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
			if (!getStripeId.stripeId) {
				const createCustomer = await stripeService.createCustomers(getStripeId, payload);
				await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { stripeId: createCustomer.id });

				const createCard = await stripeService.createCard(createCustomer, payload);
				console.log('createCardcreateCardcreateCard', createCard);
				const dataToSave = {
					userId: userData._id,
					cardDetail: createCard,
				};
				const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);
				const planInfo = await stripeService.getPlanInfo(payload);
				const createSubscript = await stripeService.createSubscription(createCustomer['id'], payload);
				console.log('createSubscriptcreateSubscript', createSubscript);
				if (createSubscript.status === 'active') {
					const insertData = {
						featuredType: checkplan.featuredType, // createSubscript['plan']['nickname'].replace(/_YEARLY|_MONTHLY/gi, ''), // step2.name,
						subscriptionType: createSubscript['plan']['interval'],  // createSubscript['plan']['interval'],
						userId: userData._id,
						startDate: new Date().getTime(),
						// endDate: new Date().setFullYear(new Date().getFullYear() + 1),
						// createdAt: new Date().getTime(),
						endDate: createSubscript.current_period_end, // new Date().setFullYear(new Date().getFullYear() + 1),
						current_period_start: createSubscript.current_period_start,
						updatedAt: new Date().getTime(),
						propertyId: payload.propertyId,
						status: createSubscript.status,
						isRecurring: payload.cancel_at_period_end,
						paymentMethod: createCard['brand'],
						amount: (createSubscript['plan']['amount'] / 100),
						subscriptionId: createSubscript.id,
						planId: createSubscript['plan']['id'],
					};

					// if (createSubscript.status === 'active') {
					if (checkplan['featuredType'] === 'HOMEPAGE_PROFILE') {
						console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>@2222222222222222222');
						await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: true });
					}
					if (checkplan['featuredType'] === 'PROFILE') {
						console.log('22222222222222222222222222222222222222222');
						await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isFeaturedProfile: true });
					}
					// }
					const step3 = await ENTITY.SubscriptionE.createOneEntity(insertData);
					console.log('step3step3step3step3step3step3step3step3', step3);
					createSubscript['subscriptionId'] = step3['_id'];
					createSubscript['paymentMethod'] = step3['paymentMethod'];
					// return;
				}
				const step2 = await ENTITY.TransactionE.addTransaction(payload, userData, createSubscript, checkplan, createCard['brand']);
				console.log('step2step2step2step2step2step2>>>>>>>>>>>>>>>>>', step2);
				return;
			} else {
				// get all card of the user
				const getUserCardInfo = await ENTITY.UserCardE.getOneEntity({ userId: userData._id }, { cardDetail: 1 });
				console.log('getUserCardInfogetUserCardInfogetUserCardInfo', getUserCardInfo);

				const fingerprint = await stripeService.getfingerPrint(userData, payload);
				console.log('fingerprintfingerprintfingerprint>222222222222', fingerprint);

				let checkCardAdded;
				if (getUserCardInfo !== null) {
					checkCardAdded = getUserCardInfo['cardDetail'].some(data => {
						return data.fingerprint === fingerprint['card']['fingerprint'];
					});
				}
				console.log('checkCardAddedcheckCardAdded>>>>>>>>>>>>>', checkCardAdded);

				if (getUserCardInfo == null) {
					console.log('22222222222222222222222222222', getUserCardInfo);
					const createCard = await stripeService.createCard2(userData, payload);
					const dataToSave = {
						userId: userData._id,
						cardDetail: createCard,
					};
					const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);
					console.log('userCardInfouserCardInfouserCardInfo', userCardInfo);
					console.log('checkCardAddedcheckCardAddedcheckCardAdded>>>>>>>@@@@@@@@@2222222222222222222222', checkCardAdded);
				}
				if (checkCardAdded === false) {
					dataToSet.$push = {
						cardDetail: fingerprint['card'],
					};
					const userCardInfo = await ENTITY.UserCardE.updateOneEntity(criteria, dataToSet);
					console.log('userCardInfouserCardInfo', userCardInfo);

					if (getUserCardInfo['cardDetail'].length >= 1) {
						const createDfaultCard = await stripeService.setDefaultCard(getStripeId, payload);
						console.log('createDfaultCardcreateDfaultCard222222222', createDfaultCard);
					}
					const createCard = await stripeService.createCard2(userData, payload);
					console.log('createCardcreateCardcreateCard', createCard);
				}
				// if (checkCardAdded === true) {
				// 	const createCard = await stripeService.createCard2(userData, payload);
				// 	console.log('createCardcreateCardcreateCardcreateCard2222222222222222222', createCard);
				// }

				const createSubscript = await stripeService.createSubscription(userData['stripeId'], payload);
				console.log('createSubscriptcreateSubscriptcreateSubscriptcreateSubscript', createSubscript);
				const step2 = await ENTITY.TransactionE.addTransaction(payload, userData, createSubscript, checkplan, fingerprint['card']['brand']);

				// get plan info

				if (createSubscript.status === 'active') {
					const insertData = {
						featuredType: checkplan.featuredType, // createSubscript['plan']['nickname'].replace(/_YEARLY|_MONTHLY/gi, ''), // step2.name,
						subscriptionType: createSubscript['plan']['interval'],  // createSubscript['plan']['interval'],
						userId: userData._id,
						startDate: new Date().getTime(),
						endDate: createSubscript.current_period_end, // new Date().setFullYear(new Date().getFullYear() + 1),
						current_period_start: createSubscript.current_period_start,
						updatedAt: new Date().getTime(),
						propertyId: payload.propertyId,
						status: createSubscript.status,
						isRecurring: payload.cancel_at_period_end,
						paymentMethod: fingerprint['card']['brand'],
						amount: (createSubscript['plan']['amount'] / 100),
						subscriptionId: createSubscript.id,
						planId: createSubscript['plan']['id'],
					};
					console.log('11111111111111111111111111111111111111111111111111');

					// if (checkplan.nickname === Constant.)
					if (checkplan['featuredType'] === 'HOMEPAGE_PROFILE') {
						console.log('?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

						await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: true });
					}
					if (checkplan['featuredType'] === 'PROFILE') {
						console.log('2222222222222222222222222222222222222222222222222222');

						await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isFeaturedProfile: true });
					}
					// ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: 'true' });
					const step3 = await ENTITY.SubscriptionE.createOneEntity(insertData);
					console.log('step3step3step3step3step3step3step3step3', step3);
					return;
				}
				// else if (createSubscript.status === 'active') {
				// 	return Promise.reject(createSubscript.status)
				// }
				return {};
				// const checkUserInStripe = await stripeManager.createCustomers()
			}
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

	async invoiceDetails(payload: TransactionRequest.Id) {
		try {
			return await ENTITY.TransactionE.invoiceDetails(payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async handleChargeSucceeded(transactioData, paymentIntent) {
		if (!transactioData.subscriptionId) {
			const payload: any = {
				featuredType: transactioData.featuredType,
				subscriptionType: transactioData.billingType,
				userId: transactioData.userId,
			};
			const step1 = await ENTITY.SubscriptionE.addSubscrition(payload);
			transactioData.subscriptionId = step1._id;
		}
		const step2 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async handleChargePending(transactioData, paymentIntent) {
		await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async handleChargeFailed(transactioData, paymentIntent) {
		await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async updateSubscriptionStatus(paymentIntent) {
		//  if(paymentIntent.status==='active')
		// await ENTITY.SubscriptionE.updateSubscriptionStatus(paymentIntent)

		// await ENTITY.WebhookE.createOneEntity()
		const getUser = {
			stripeId: paymentIntent['customer'],
		};
		const getUserInfo = await ENTITY.UserE.getOneEntity(getUser, {});
		console.log('getUserInfogetUserInfogetUserInfo', getUserInfo);

		// console.log('getUserInfogetUserInfogetUserInfo', getUserInfo);

		// const getUserInfo()
		// await ENTITY.SubscriptionE
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
					await this.updateSubscriptionStatus(paymentIntent);
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
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
			console.log('payloadpayloadpayloadpayloadpayloadpayload', payload);

			const getUserCriteria = {
				_id: userData._id,
			};
			// const criteria = {
			// 	userId: userData._id,
			// };
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
			let createCustomer;
			const dataToSet: any = {};
			if (!getStripeId.stripeId) {
				createCustomer = await stripeService.createCustomers(getStripeId, payload);
				await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { stripeId: createCustomer.id });
				const createCard = await stripeService.createCard(createCustomer['id'], payload);

				const createSubscript = await stripeService.createSubscription(createCustomer['id'], payload);
				console.log('createSubscriptcreateSubscript', createSubscript);
				return;
			} else {
				const createCard = await stripeService.createCard(getStripeId['stripeId'], payload);
				const setDefaultCard = await stripeService.setDefaultCard(getStripeId, payload);
				const createSubscript = await stripeService.createSubscription(getStripeId['stripeId'], payload);
				console.log('createSubscriptcreateSubscript', createSubscript);
				return;
			}
			// console.log('createCardcreateCardcreateCard', createCard);
			// const dataToSave = {
			// 	userId: userData._id,
			// 	cardDetail: createCard,
			// };

			// const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);
			// const planInfo = await stripeService.getPlanInfo(payload);

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

	async invoiceDetails(payload: TransactionRequest.Id) {
		try {
			return await ENTITY.TransactionE.invoiceDetails(payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

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
			if (event['data']['object']['billing_reason'] !== 'subscription_cycle') {
				const CheckplaninDb = {
					'plans.planId': event['data']['object']['lines']['data'][0]['plan']['id'],
				};
				const criteria = {
					stripeId: event['data']['object']['customer'],
				};
				const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
				const userData = await ENTITY.UserE.getOneEntity(criteria, { _id: 1 });
				console.log('userDatauserData', userData);

				const step2 = await ENTITY.TransactionE.addTransaction(event, userData, checkplan);
				console.log('step2>>>>>>>>>>>>>>>>>>>', step2);
				/**
				 * TODO @for to update the recurrign subscription
				 */
				if (event['data']['object']['billing_reason'] === 'subscription_cycle') {

				}
			}
			return;
		} catch (error) {
			console.log('errorerrorerrorerrorerrorerror>>>>>>>>>>>>>>.', error);
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
			console.log('subscriptionDatasubscriptionData', subscriptionData);
			const userData = await ENTITY.UserE.getOneEntity({ stripeId: subscriptionData['data']['object']['customer'] }, { _id: 1 });
			const CheckplaninDb = {
				'plans.planId': subscriptionData['data']['object']['plan']['id'],
			};
			// if (subscriptionData.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
			console.log('checkplancheckplancheckplan', checkplan);
			// }
			const updatePropertyAddedBy = {
				'property_added_by.userId': userData._id,
			};
			const insertData = {
				featuredType: checkplan.featuredType, // createSubscript['plan']['nickname'].replace(/_YEARLY|_MONTHLY/gi, ''), // step2.name,
				subscriptionType: subscriptionData['data']['object']['plan']['interval'],  // subscriptionData['plan']['interval'],
				userId: userData['_id'],
				startDate: (subscriptionData['data']['object']['start_date'] * 1000),
				endDate: (subscriptionData['data']['object']['current_period_end'] * 1000), // new Date().setFullYear(new Date().getFullYear() + 1),
				current_period_start: (subscriptionData['data']['object']['current_period_start'] * 1000),
				status: subscriptionData['data']['object']['status'],
				isRecurring: !subscriptionData['data']['object']['cancel_at_period_end'],
				// paymentMethod: createCard['brand'],
				amount: (subscriptionData['data']['object']['plan']['amount'] / 100),
				subscriptionId: subscriptionData['data']['object']['id'],
				planId: subscriptionData['data']['object']['plan']['id'],
			};
			console.log('insertDatainsertDatainsertData', insertData);
			const step3 = await ENTITY.SubscriptionE.createOneEntity(insertData);

			if (step3.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				if (checkplan['featuredType'] === 'HOMEPAGE_PROFILE') {
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>@2222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: true });
					await ENTITY.PropertyE.updateMultiple(updatePropertyAddedBy, { $set: { 'property_added_by.isHomePageFeatured': true } });
				}
				if (checkplan['featuredType'] === 'PROFILE') {
					console.log('22222222222222222222222222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isFeaturedProfile: true });
					await ENTITY.PropertyE.updateMultiple(updatePropertyAddedBy, { $set: { 'property_added_by.isFeatured': true } });
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

	async cancelUpdateSubscription(event) {
		try {
			const getUser = {
				stripeId: event['data']['object']['customer'],
			};
			const userId = await ENTITY.UserE.getOneEntity(getUser, { _id: 1 });
			if (event['data']['object']['cancel_at_period_end']) {
				// console.log('userSubscriptionIduserSubscriptionIduserSubscriptionId', userSubscriptionData);
				// if (userSubscriptionData['status'] !== Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				// 	return Constant.STATUS_MSG.ERROR.E401.SUBSCRIPTION_INACTIVE;
				// }
				// console.log('userSubscriptionIduserSubscriptionId', userSubscriptionData['subscriptionId']);
				// console.log('stripeDatastripeDatastripeData', stripeData);
				const updateSubscription = {
					isRecurring: false,
					endDate: event['data']['object']['current_period_end'],
				};
				const data = await ENTITY.SubscriptionE.updateOneEntity({ userId: userId._id, subscriptionId: event['data']['object']['id'] }, { $set: { isRecurring: false } });

				/**
				 * TODO also updated when in the property added by
				 */
				return;
			}
			else {
				const dataToupdate = {
					startDate: (event['data']['object']['current_period_start'] * 1000),
					endDate: (event['data']['object']['current_period_end'] * 1000),
					// eventId: event.id,
				};
				const criteria = {
					userId: userId._id,
					subscriptionId: event['data']['object']['id'],
					status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
				};
				if (event['data']['object']['status'] === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
					const data = await ENTITY.SubscriptionE.updateOneEntity(criteria, { $set: dataToupdate });
					return;
				}
				else {
					// in case of pending or indufficient fund
					const getPlanInfo = {
						planId: event['data']['object']['plan']['id'],
					};
					const getPlanData = await ENTITY.SubscriptionPlanEntity.getOneEntity({ 'plans.planId': getPlanInfo }, {});
					if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE) {
						//  cancel subscription
						const propertyCriteria = {
							'property_added_by.isHomePageFeatured': true,
						};
						await ENTITY.UserE.updateOneEntity(getUser, { $set: { isHomePageFeatured: false } });
						// await ENTITY.PropertyE.updateOneEntity()
						await ENTITY.PropertyE.updateOneEntity({ 'property_added_by.userId': userId._id }, { $set: propertyCriteria });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.PROFILE) {
						await ENTITY.UserE.updateOneEntity(getUser, { $set: { isFeatured: false } });
						const propertyCriteria = {
							'property_added_by.isFeatured': true,
						};
						await ENTITY.PropertyE.updateOneEntity({ 'property_added_by.userId': userId._id }, { $set: propertyCriteria });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {

						// await ENTITY.PropertyE.updateOneEntity({ 'property_added_by.userId': userId._id }, { $set: propertyCriteria });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {

					}

				}
				return;
			}

			// const subscriptionUserId = await ENTITY.SubscriptionE.updateOneEntity()

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateDeletSubscription(event) {
		try {
			const getUser = {
				stripeId: event['data']['object']['customer'],
			};
			const getUserId = await ENTITY.UserE.getOneEntity(getUser, { _id: 1, stripeId: 1, isHomePageFeatured: 1, isFeatured: 1 });

			const getSubscriptionInfo = {
				subscriptionId: event['data']['object']['id'],
				status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
				userId: getUserId._id,
			};
			const getsubscriptionInfo = await ENTITY.SubscriptionE.getOneEntity(getSubscriptionInfo, {});

			if (getsubscriptionInfo && getSubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE) {
				ENTITY.SubscriptionE.updateOneEntity(getSubscriptionInfo, { $set: { status: event['data']['object']['status'] } });
				await ENTITY.UserE.updateOneEntity({ _id: getUserId._id, isHomePageFeatured: true }, { $set: { isHomePageFeatured: false } });
				ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': getUserId._id }, { $set: { IsHomePageFeatured: false } })
			}
			else if (getsubscriptionInfo && getSubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.PROFILE) {
				ENTITY.SubscriptionE.updateOneEntity(getSubscriptionInfo, { $set: { status: event['data']['object']['status'] } });
				await ENTITY.UserE.updateOneEntity({ _id: getUserId._id, isHomePageFeatured: true }, { $set: { isFeatured: false } });
				ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': getUserId._id }, { $set: { isFeatured: false } });
			}
			else if (getsubscriptionInfo && getSubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY && getSubscriptionInfo['propertyId']) {
				ENTITY.SubscriptionE.updateOneEntity({ userId: getUserId._id, subscriptionId: event['data']['object']['id'] }, { $set: { status: event['data']['object']['status'] } });
				ENTITY.PropertyE.updateOneEntity({ _id: getSubscriptionInfo['propertyId'] }, { $set: { isHomePageFeatured: false } });

			}
			else if (getsubscriptionInfo && getSubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.PROPERTY && getSubscriptionInfo['propertyId']) {
				ENTITY.SubscriptionE.updateOneEntity({ userId: getUserId._id, subscriptionId: event['data']['object']['id'] }, { $set: { status: event['data']['object']['status'] } });
				ENTITY.PropertyE.updateOneEntity({ _id: getSubscriptionInfo['propertyId'] }, { $set: { isFeatured: false } });
			}

			const getPlanInfo = {
				planId: event['data']['object']['id'],
			};
			const criteria = {
				userId: getUserId._id,

			};
			// const getsubscriptionInfo = await ENTITY.SubscriptionE.getOneEntity(criteria)
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateSubscription(event) {
		try {
			if (event['data']['object']['billing_reason'] === 'subscription_cycle') {

			}

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async webhook(payload) {
		// const step1 = await ENTITY.TransactionE.findTransactionById({ transactionId: payload.data.object.balance_transaction });
		// console.log('step1step1step1step1step1step1step1step1step1step1', step1);

		// const step2 = await ENTITY.WebhookE.addWebhook({ transactionId: step1._id, webhookObject: payload });
		const addWebhook = await ENTITY.WebhookE.createOneEntity({ webhookObject: payload });
		// console.log('addWebhookaddWebhook>>>>>>>>>>>>>>>>>>>>>>', addWebhook);
		try {
			const event = payload;
			const paymentIntent = event.data.object;
			console.log('paymentIntentpaymentIntentpaymentIntent', paymentIntent);
			console.log('jSON STRINFIFYoBJECT>>>>>>>>>>>>>>>>>>>>>>>>>>>', JSON.stringify(event));
			// Handle the event
			switch (event.type) {
				case 'charge.succeeded':
					console.log('111111111111111111111111111111111111111111111111111');
					// await this.handleChargeSucceeded(step1, paymentIntent);
					break;
				case 'charge.pending':
					console.log('2222222222222222222222222222222222222222222');
					// await this.handleChargePending(step1, paymentIntent);
					break;
				case 'charge.failed':
					console.log('33333333333333333333333333333333333333');
					// await this.handleChargeFailed(step1, paymentIntent);
					break;
				case 'customer.subscription.deleted':
					console.log('6666666666666666666666666666666666666666666666666666');
					await this.updateDeletSubscription(event);
					break;
				case 'customer.subscription.created':
					console.log('8888888888888888888888888888888888888888', event);
					await this.createSubscription(event);
					break;

				case 'invoice.payment_succeeded':
					console.log('9999999999999999999999999', event);
					await this.createInvoice(event);
					break;
				case 'invoice.created':
					console.log('100111111111111111111111111112100>>>>>>>>>>', event);
					break;

				case 'invoice.finalized':
					console.log('invoice.finalized>>>>>>>>>>>>>>>>>>>>>>>>>', event);
					this.updateSubscription(event);
					break;

				case 'customer.subscription.updated':
					console.log('customer.subscription.updated>>>>>>>>>>>>', event);
					await this.cancelUpdateSubscription(event);

					break;

				case 'subscription_schedule.canceled':
					console.log('subscription_schedule.canceledsubscription_schedule.canceled>>>>>>>>', event);

					break;
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
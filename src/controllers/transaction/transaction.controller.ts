import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { stripeService } from '@src/lib/stripe.manager';

import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils';
import { Types } from 'mongoose';
import { invoiceNumber } from '../../utils';
import { ObjectId } from 'bson';

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
				console.log('createCardcreateCardcreateCard', createCard);

				const dataToSave = {
					name: payload.name,
					address: payload.address,
					userId: userData._id,
					cardDetail: createCard,
				};

				const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);

				const createSubscript = await stripeService.createSubscription(createCustomer['id'], payload);
				console.log('createSubscriptcreateSubscript', createSubscript);
				if (createSubscript.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
					const data: any = await this.createSubscription(createSubscript, payload, createCard);
					const dataToUpdate = {
						latestInvoice: createSubscript.latest_invoice,
					};
					// await ENTITY.TransactionE.updateOneEntity({ invoiceId: createSubscript.latestInvoice }, {})
				}
				return;
			} else {
				const query = [
					{
						$match: {
							userId: userData._id,
						},
					},
					{
						$project: {
							fingerprint: '$cardDetail.card.fingerprint',
						},
					},
					{
						$group: {
							_id: '$cardDetail.card.fingerprint',
							fingerprint: {
								$push: '$fingerprint',
							},
						},
					},
				];
				const cardData = await ENTITY.UserCardE.aggregate(query);
				console.log('cardDatacardDatacardData>>>>>>>>>>>>>>>>>>>>>>.', cardData);
				// get all card of the user
				// const getUserCardInfo = await ENTITY.UserCardE.getMultiple({ userId: userData._id }, { cardDetail: 1 });
				// console.log('getUserCardInfogetUserCardInfogetUserCardInfo', getUserCardInfo);

				const fingerprint = await stripeService.getfingerPrint(userData, payload);
				console.log('fingerprintfingerprintfingerprint>222222222222', fingerprint);
				// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', cardData[0]['fingerprint'].some(data => { return data === fingerprint }c));
				let checkCardAdded;
				if (cardData.length !== 0) {
					checkCardAdded = cardData[0]['fingerprint'].some(data => {
						return data === fingerprint;
					});
				}
				console.log('1>>>>>>>>>>>>', checkCardAdded);

				// 	checkCardAdded = getUserCardInfo['cardDetail'].some(data => {
				// 		return data.fingerprint === fingerprint['card']['fingerprint'];
				// 	});
				// }

				if (checkCardAdded || cardData.length === 0) {
					const dataToSave = {
						name: payload.name,
						address: payload.name,
						userId: userData._id,
						cardDetail: fingerprint,
					};

					const createCard = await stripeService.createCard(getStripeId['stripeId'], payload);
					const userCardInfo = await ENTITY.UserCardE.createOneEntity(dataToSave);
					const setDefaultCard = await stripeService.setDefaultCard(getStripeId, payload);
				}
				const createSubscript = await stripeService.createSubscription(getStripeId['stripeId'], payload);

				// console.log('createSubscriptcreateSubscript', createSubscript);
				if (createSubscript.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
					await this.createSubscription(createSubscript, payload, fingerprint['card']);
				}
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

	async invoiceDetails(payload: TransactionRequest.Id, userData) {
		try {
			return await ENTITY.TransactionE.invoiceDetails(payload, userData);
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
			// if (event['data']['object']['billing_reason'] !== 'subscription_cycle') {
			const CheckplaninDb = {
				'plans.planId': event['data']['object']['lines']['data'][0]['plan']['id'],
			};
			const criteria = {
				stripeId: event['data']['object']['customer'],
			};
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
			const userData = await ENTITY.UserE.getOneEntity(criteria, { _id: 1 });
			console.log('userDatauserData', userData);

			const step2 = await ENTITY.TransactionE.updateTransaction(event, userData, checkplan);
			// console.log('step2>>>>>>>>>>>>>>>>>>>', step2);
			/**
			 * TODO @for to update the recurrign subscription
			 */

			if (event['data']['object']['billing_reason'] === 'subscription_cycle') {

				// }
				// }
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

	async createSubscription(subscriptionData, payload, createCard) {
		try {
			console.log('111111111', subscriptionData, '>>>>>>>>>>>>>>>>>>>>>>>.', payload);

			const userData = await ENTITY.UserE.getOneEntity({ stripeId: subscriptionData['customer'] }, { _id: 1 });
			const CheckplaninDb = {
				'plans.planId': subscriptionData['plan']['id'],
			};
			// if (subscriptionData.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
			const checkplan = await ENTITY.SubscriptionPlanEntity.getOneEntity(CheckplaninDb, {});
			console.log('checkplancheckplancheckplan', checkplan);
			// }
			const updatePropertyAddedBy = {
				'property_added_by.userId': new Types.ObjectId(userData._id),
			};
			const insertData = {
				name: payload.name,
				address: payload.address,
				featuredType: checkplan.featuredType, // createSubscript['plan']['nickname'].replace(/_YEARLY|_MONTHLY/gi, ''), // step2.name,
				subscriptionType: subscriptionData['plan']['interval'],  // subscriptionData['plan']['interval'],
				userId: userData['_id'],
				startDate: (subscriptionData['start_date'] * 1000),
				endDate: (subscriptionData['current_period_end'] * 1000), // new Date().setFullYear(new Date().getFullYear() + 1),
				current_period_start: (subscriptionData['current_period_start'] * 1000),
				status: subscriptionData['status'],
				isRecurring: !subscriptionData['cancel_at_period_end'],
				// paymentMethod: createCard['brand'],
				amount: (subscriptionData['plan']['amount'] / 100),
				subscriptionId: subscriptionData['id'],
				planId: subscriptionData['plan']['id'],
				cardExpYear: createCard.exp_year,
				cardLast4: createCard.last4,
				cardBrand: createCard.brand,
				invoiceId: subscriptionData['latest_invoice'],
				cardId: createCard['id'],
			};
			console.log('insertDatainsertDatainsertData', insertData);
			const step3 = await ENTITY.SubscriptionE.createOneEntity(insertData);

			if (step3.status === Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE) {
				if (checkplan['featuredType'] === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE) {
					console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>@2222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isHomePageFeatured: true });
					await ENTITY.PropertyE.updateMultiple(updatePropertyAddedBy, { $set: { 'property_added_by.isHomePageFeatured': true } });
					return;
				}
				if (checkplan['featuredType'] === Constant.DATABASE.FEATURED_TYPE.PROFILE) {
					console.log('22222222222222222222222222222222222222222');
					await ENTITY.UserE.updateOneEntity({ _id: userData._id }, { isFeaturedProfile: true });
					await ENTITY.PropertyE.updateMultiple(updatePropertyAddedBy, { $set: { 'property_added_by.isFeaturedProfile': true } });
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
					userId: new Types.ObjectId(userId._id),
					subscriptionId: event['data']['object']['id'],
					// status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
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
					console.log('getPlanInfo?>>>>>', getPlanInfo);

					const getPlanData = await ENTITY.SubscriptionPlanEntity.getOneEntity({ 'plans.planId': getPlanInfo.planId }, {});
					if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE) {
						//  cancel subscription
						const propertyCriteria = {
							'property_added_by.isHomePageFeatured': false,
						};
						await ENTITY.UserE.updateOneEntity(getUser, { $set: { isHomePageFeatured: false } });
						// await ENTITY.PropertyE.updateOneEntity()
						await ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': userId._id }, { $set: propertyCriteria });
						await ENTITY.SubscriptionE.updateOneEntity(criteria, { $set: { status: event['data']['object']['status'] } });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.PROFILE) {
						await ENTITY.UserE.updateOneEntity(getUser, { $set: { isFeaturedProfile: false } });
						const propertyCriteria = {
							'property_added_by.isFeaturedProfile': false,
						};
						await ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': userId._id }, { $set: propertyCriteria });
						await ENTITY.SubscriptionE.updateOneEntity(criteria, { $set: { status: event['data']['object']['status'] } });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {
						const data = await ENTITY.SubscriptionE.updateOneEntity(criteria, { $set: { status: event['data']['object']['status'] } });
						console.log('data>>>>>>>>>', data);

						await ENTITY.PropertyE.updateOneEntity({ _id: new Types.ObjectId(data.propertyId), 'property_added_by.userId': userId._id }, { $set: { isHomePageFeatured: false } });
					}
					else if (getPlanData.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
						const data = await ENTITY.SubscriptionE.updateOneEntity(criteria, { $set: { status: event['data']['object']['status'] } });
						console.log('datadata', data);

						await ENTITY.PropertyE.updateOneEntity({ _id: new Types.ObjectId(data.propertyId), 'property_added_by.userId': userId._id }, { $set: { isFeatured: false } });
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
			const getUserId = await ENTITY.UserE.getOneEntity(getUser, { _id: 1, stripeId: 1, isHomePageFeatured: 1, isFeaturedProfile: 1 });
			console.log('getUserIdgetUserId', getUserId);
			// if (event.data.object.plan.id === 'gold_00000000000000') {
			//          pl
			// }

			const getSubscriptionCriteria = {
				subscriptionId: event['data']['object']['id'],
				status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
				userId: new Types.ObjectId(getUserId._id),
			};
			const getsubscriptionInfo = await ENTITY.SubscriptionE.getOneEntity(getSubscriptionCriteria, {});

			if (getsubscriptionInfo && getsubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE) {
				console.log('111111111111111111111111');
				await ENTITY.SubscriptionE.updateOneEntity(getSubscriptionCriteria, { $set: { status: event['data']['object']['status'] } });
				await ENTITY.UserE.updateOneEntity({ _id: new Types.ObjectId(getUserId._id) }, { $set: { isHomePageFeatured: false } });
				await ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': getUserId._id }, { $set: { 'property_added_by.isHomePageFeatured': false } });
			}
			else if (getsubscriptionInfo && getsubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.PROFILE) {
				console.log('222222222222222222222222222222');
				ENTITY.SubscriptionE.updateOneEntity(getSubscriptionCriteria, { $set: { status: event['data']['object']['status'] } });
				await ENTITY.UserE.updateOneEntity({ _id: new Types.ObjectId(getUserId._id) }, { $set: { isFeaturedProfile: false } });
				ENTITY.PropertyE.updateMultiple({ 'property_added_by.userId': getUserId._id }, { $set: { 'property_added_by.isFeaturedProfile': false } });
			}
			else if (getsubscriptionInfo && getsubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {
				console.log('333333333333333333333333333333333333333333333333');
				ENTITY.SubscriptionE.updateOneEntity({ userId: new Types.ObjectId(getUserId._id), subscriptionId: event['data']['object']['id'] }, { $set: { status: event['data']['object']['status'] } });
				ENTITY.PropertyE.updateOneEntity({ _id: getSubscriptionCriteria['propertyId'] }, { $set: { isHomePageFeatured: false } });

			}
			else if (getsubscriptionInfo && getsubscriptionInfo['featuredType'] === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
				console.log('444444444444444444444444444444444444444444444444444444444444');
				ENTITY.SubscriptionE.updateOneEntity({ userId: new Types.ObjectId(getUserId._id), subscriptionId: event['data']['object']['id'] }, { $set: { status: event['data']['object']['status'] } });
				ENTITY.PropertyE.updateOneEntity({ _id: getsubscriptionInfo['propertyId'] }, { $set: { isFeatured: false } });
			}

			const getPlanInfo = {
				planId: event['data']['object']['id'],
			};
			const criteria = {
				userId: getUserId._id,

			};
			return;
			// const getsubscriptionInfo = await ENTITY.SubscriptionE.getOneEntity(criteria)
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateSubscription(event) {
		try {
			if (event['data']['object']['billing_reason'] === 'subscription_cycle') {

			};

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async updateTransaction(event) {
		try {
			const createTransaction = {
				cardId: event['data']['object']['payment_method'],
				brand: event['data']['object']['payment_method_details']['card']['brand'],
				last4: event['data']['object']['payment_method_details']['last4'],
				exp_year: event['data']['object']['payment_method_details']['exp_year'],
				exp_month: event['data']['object']['payment_method_details']['exp_month'],
			};
			console.log('updateTransaction2222222222>>>>>>>>>>>>>>>>>>>>>>>', createTransaction);

			const createTransction = await ENTITY.TransactionE.updateOneEntity({
				invoiceId: event['data']['object']['invoice'],
			},
				{
					$set: createTransaction,
					$setOnInsert: {
						createdAt: Date.now(),
						invoiceNo: invoiceNumber(++global.counters.Transaction),
					},
				},
				{
					new: true, upsert: true,
				});

			// const createTransction = await ENTITY.TransactionE.createOneEntity(createTransaction);
			console.log('createTransctioncreateTransctioncreateTransction>>>>>>>>>>>>.', createTransction);
			return createTransction;

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
					await this.updateTransaction(event);
					break;
				case 'charge.pending':
					console.log('2222222222222222222222222222222222222222222');
					await this.updateTransaction(event);
					break;
				case 'charge.failed':
					console.log('33333333333333333333333333333333333333');
					await this.updateTransaction(event);
					break;
				case 'customer.subscription.deleted':
					console.log('6666666666666666666666666666666666666666666666666666');
					await this.updateDeletSubscription(event);
					break;
				case 'customer.subscription.created':
					console.log('8888888888888888888888888888888888888888', event);
					// await this.createSubscription(event);
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

				case 'invoice.payment_failed':
					console.log('invoice.payment_failed>>>>>>>>>>>>>>>>>>>', event);
					this.createInvoice(event);
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
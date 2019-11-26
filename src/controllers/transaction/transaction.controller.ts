import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
// import * as Contsant from '@src/constants/app.constant';
// import * as Stripe from 'stripe';
import { StripeManager } from '@src/lib/stripe.manager';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils';

// const stripe = new Stripe('sk_test_bczq2IIJNuLftIaA79Al1wrx00jgNAsPiU');
const stripeManager = new StripeManager();

class TransactionController extends BaseEntity {

	// async checkCustomer(payload, userData) {
	//     try {
	//         const data = await ENTITY.PaymentE.getOneEntity({ userId: userData._id }, { stripeCustomerId: 1 });
	//         console.log('datadatadatadata', data);

	//         if (data) {
	//             return data;
	//         } else {
	//             // const customer = await stripe.customers.create({ description: userData.userName });
	//             const customer = await stripeManager.createCustomers({ description: userData.userName });
	//             const dataToSave = {
	//                 userId: userData._id,
	//                 stripeCustomerId: customer.id,
	//             };
	//             const data1 = await ENTITY.PaymentE.createOneEntity(dataToSave);
	//             return data1;
	//         }
	//     } catch (error) {
	//         return Promise.reject(error);
	//     }
	// }

	async addCustomerCard(payload: any, userData) {
		try {
			console.log('userDatauserDatauserDatauserDatauserData', userData);

			// await stripe.customers.createSource(userData.stripeCustomerId, { source: payload.source });
			const addCard: any = {};
			const cusData: any = await ENTITY.PaymentE.getOneEntity({ userId: userData._id }, {});
			console.log('cusDatacusDatacusDatacusData', cusData);

			//    if(cusData.)
			if (!cusData) {
				// const customer = await stripe.customers.create({ description: userData.userName });
				const customer = await stripeManager.createCustomers({ description: userData.userName });

				const addCard1 = await stripeManager.createCustomersSource(customer.id, payload.cardToken);
				console.log('addCard>>>>>>>>>>>>>>>>>>>>>>>>>>>>.', addCard1);
				const createData = {
					userId: userData._id,
					stripeCustomerId: customer.id,
					// cardDetails: [{
					//     cardNumber: { type: Number },
					//     cvvNumber: { type: Number },
					//     expiryDate:{}
					// }]
					// fingerPrint: { type: String },
					cardDetail: [addCard1],
				};
				console.log('createDatacreateDatacreateDatacreateData', createData);

				const userCard = await ENTITY.PaymentE.createOneEntity(createData);
				return userCard;
			} else {
				const dataToUpdate: any = {};
				// get the info of the card
				const cardInfo = await ENTITY.PaymentE.cardInfo(payload, cusData);
				console.log('cardInfocardInfocardInfocardInfo', cardInfo);
				if (cardInfo === true) {
					return Promise.reject('Already card added');
				} else {
					const criteria1 = {
						userId: userData._id,
					};
					cardInfo.createdAt = new Date();
					// dataToUpdate.$ = {};
					dataToUpdate.$push = {
						cardDetail: cardInfo,
					};
					console.log('dataToUpdatedataToUpdatedataToUpdatedataToUpdate', { $set: dataToUpdate });

					const aaa = await ENTITY.PaymentE.updateOneEntity(criteria1, dataToUpdate);
					console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', aaa);
					console.log('cusDatacusDatacusData>>>>>>>>>>>>>>>>>>>iddddddddddddddd', cusData.id);

					const addCard1 = await stripeManager.createCustomersSource(cusData.stripeCustomerId, payload.cardToken);
					console.log('addCard1addCard1addCard1addCard1addCard1addCard1addCard1', addCard1);

					// console.log('cardCheckcardCheckcardCheckcardCheckcardCheck', cardCheck);
					return {};
				}

				// cusData['cardDetail'].find(async doc => {
				//     console.log('docdocdocdocdoc', doc);
				//     if (doc.fingerPrint === cardInfo['fingerPrint']) {
				//         console.log(true);
				//         return Promise.reject('Already card added');
				//         // return true;
				//     } else {
				// console.log('false');
				// // return cardInfo;
				// const dataToUpdate: any = {};

				// const criteria = {
				//     userId: userData._id,
				// };
				// dataToUpdate.$push = {
				//     cardToken: cardInfo,
				// };
				// const aaa = await ENTITY.PaymentE.updateOneEntity(criteria, dataToUpdate);
				// console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', aaa);
				// // console.log('cardCheckcardCheckcardCheckcardCheckcardCheck', cardCheck);
				// return {};
			}
		}
		// if (cardCheck) {
		//     return Promise.reject('Already card added');
		// } else {
		//     const dataToUpdate: any = {};

		//     const criteria = {
		//         userId: userData._id,
		//     };
		//     dataToUpdate.$push = {
		//         cardToken: cardCheck,
		//     };
		//     const aaa = await ENTITY.PaymentE.updateOneEntity(criteria, dataToUpdate);
		//     console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', aaa);

		// }

		// }
		// }

		// console.log('datadatadatadata', data);
		// if (data) {
		//     const criteria = {
		//         userId: userData._id,
		//     };

		// addCard.$set = {
		//     userId: userData._id,
		//     stripeCustomerId: data.stripeCustomerId,
		// };
		// db.student.update( { "sem": 1}, { $addToSet: { "achieve": 92 } } );

		// addCard = {
		//     $addToSet: {
		//         cardToken: payload.cardToken,
		//     },
		// };

		// const data1 = await stripe.customers.retrieveSource(data.stripeCustomerId, payload.cardToken);
		// console.log('data1data1data1data1data1data1data1data1', data1);

		// const customer = await stripe.customers.create({ description: userData.userName });
		// console.log('customercustomercustomercustomer', customer);

		// const dataToUpdate = {
		// userId: userData._id,
		// stripeCustomerId: customer.id,
		// };
		// const data1 = await ENTITY.PaymentE.updateOneEntity(criteria, addCard);

		//         console.log('addCardaddCardaddCardaddCardaddCard', data1);

		//         return data1;

		//     }
		//     else {
		//         const customer = await stripe.customers.create({ description: userData.userName });
		//         console.log('customercustomercustomercustomer', customer);
		//         const dataToSave: any = {};

		//         dataToSave.$set = {
		//             userId: userData._id,
		//             stripeCustomerId: customer.id,
		//         };

		//         dataToSave.$push = {
		//             cardToken: payload.cardToken,
		//         };

		//         const addCard1 = await stripe.customers.createSource(customer.id, { source: payload.cardToken });
		//         console.log('addCard>>>>>>>>>>>>>>>>>>>>>>>>>>>>.', addCard1);

		//         const data1 = await ENTITY.PaymentE.createOneEntity(dataToSave);
		//         console.log('data11111111111111111111111', data1);

		//         return data1;
		//     }
		// }
		// const stripeOrder = await stripe.orders.create(payload);
		// console.log(`Order created: ${stripeOrder.id}`);
		// const bankData = await ENTITY.LoanEntity.createOneEntity(payload);

		catch (error) {
			console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', error);

			return Promise.reject(error);
		}
	}

	// async deleteCard(payload, userData) {
	//     try {
	//         const criteria = {
	//             userId: userData._id,
	//         };
	//         const userCards = await ENTITY.PaymentE.getOneEntity(criteria, {});
	//         console.log('userCardsuserCardsuserCardsuserCards', userCards);

	//         const data = await stripeManager.deleteCustomersSource(userCards.stripeCustomerId, payload.cardToken);
	//         // asynchronously called
	//         console.log('dattttttttttttttttttttttttttttttttttttttttttttaaaaaaaaaa', data);
	//         return data;
	//     } catch (error) {
	//         console.log('errorrrrrrrrrrrrrrrrrrrr', error);

	//         return Promise.reject(error);
	//     }
	// }

	async createCharge(payload: TransactionRequest.CreateCharge, userData) {
		try {
			const step1 = await stripeManager.createCharges({
				// amount: payload.amount * (0.01967 * 100),
				amount: payload.amount * 100,
				currency: payload.currency,
				source: payload.source,
				description: payload.description
			});
			// const step2 = await ENTITY.SubscriptionE.addSubscrition(payload, userData);
			// payload.subscriptionId = step2._id;
			const step2 = await ENTITY.TransactionE.addTransaction(payload, userData, step1);
			return {};
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async invoiceList(payload: TransactionRequest.InvoiceList, userData) {
		try {
			return await ENTITY.TransactionE.invoiceList(payload, userData);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async handleChargeSucceeded(transactioData, paymentIntent) {
		if (!transactioData.subscriptionId) {
			let payload: any = {
				featuredType: transactioData.featuredType,
				billingType: transactioData.billingType,
				userId: transactioData.userId
			};
			const step1 = await ENTITY.SubscriptionE.addSubscrition(payload);
			transactioData.subscriptionId = step1._id;
		}
		const step2 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async handleChargePending(transactioData, paymentIntent) {
		const step1 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async handleChargeFailed(transactioData, paymentIntent) {
		const step1 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async webhook(payload) {
		console.log(payload, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		const step1 = await ENTITY.TransactionE.findTransactionById({ "transactionId": payload.data.object.balance_transaction });
		try {
			let event = payload;
			const paymentIntent = event.data.object;
			// Handle the event
			switch (event.type) {
				case 'charge.succeeded':
					this.handleChargeSucceeded(step1, paymentIntent);
					break;
				case 'charge.pending':
					this.handleChargePending(step1, paymentIntent);
					break;
				case 'charge.failed':
					this.handleChargeFailed(step1, paymentIntent);
					break;
				// ... handle other event types
				default:
					// Unexpected event type
					console.log("default=====================>", event.type);
			}
			return {};

		} catch (error) {
			utils.consolelog('StripeManager', error, false);
			error.message = Constant.STATUS_MSG.ERROR.E400.WEBHOOK_ERROR(error).message;
			return Promise.reject(error);
		}
	}
}

export const transactionController = new TransactionController();
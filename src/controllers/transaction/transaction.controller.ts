import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { StripeManager } from '@src/lib/stripe.manager';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils';

const stripeManager = new StripeManager();

class TransactionController extends BaseEntity {

	async createCharge(payload: TransactionRequest.CreateCharge, userData) {
		try {
			const step1 = await stripeManager.createCharges({
				// amount: payload.amount * (0.01967 * 100),
				amount: payload.amount * 100,
				currency: payload.currency,
				source: payload.source,
				description: payload.description,
			});
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
		const step1 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async handleChargeFailed(transactioData, paymentIntent) {
		const step1 = await ENTITY.TransactionE.updateTransactionStatus(transactioData, paymentIntent);
		return {};
	}

	async webhook(payload) {
		console.log(payload, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		const step1 = await ENTITY.TransactionE.findTransactionById({ transactionId: payload.data.object.balance_transaction });
		const step2 = await ENTITY.WebhookE.addWebhook({ transactionId: step1._id, webhookObject: payload });
		try {
			const event = payload;
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
					console.log('default=====================>', event.type);
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
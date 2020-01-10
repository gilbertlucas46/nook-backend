'use strict';

import { Types } from 'mongoose';

import { BaseEntity } from '@src/entity/base/base.entity';
import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as utils from '@src/utils';

export class TransactionClass extends BaseEntity {

	constructor() {
		super('Transaction');
	}

	async findTransactionById(payload) {
		try {
			const query: any = {};
			query.transactionId = payload.transactionId;
			return await this.DAOManager.findOne(this.modelName, query, {});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	// async addTransaction(payload: TransactionRequest.CreateCharge, userData, chargeData, getSubscriptionDetailInDb, brandName) {
	// 	try {
	// 		console.log('chargeDatachargeDatachargeDatachargeDatachargeDatachargeData', chargeData);

	// 		return await this.DAOManager.saveData(this.modelName, {
	// 			transactionId: chargeData.id,
	// 			amount: (chargeData['plan']['amount'] / 100),
	// 			currency: chargeData['plan']['currency'],
	// 			receiptUrl: chargeData['items']['url'],
	// 			description: chargeData.description,  // to be remove
	// 			status: chargeData['status'],
	// 			userId: userData._id,
	// 			subscriptionId: chargeData['subscriptionId'],
	// 			address: payload.address,
	// 			featuredType: getSubscriptionDetailInDb['featuredType'], // chargeData['plan']['nickname'], // payload.featuredType,
	// 			billingType: chargeData['plan']['interval'],  // payload.billingType,
	// 			// paymentMethod: chargeData.payment_method_details.card.brand,
	// 			// paymentObject: chargeData,
	// 			productId: chargeData['plan']['product'],
	// 			cardHolder: payload.name,
	// 			paymentMethod: brandName,
	// 		});
	// 	} catch (error) {
	// 		utils.consolelog('Error', error, true);
	// 		return Promise.reject(error);
	// 	}
	// }

	async addTransaction(invoice, userData, checkplan) {
		try {
			// return await this.DAOManager.saveData(this.modelName, {
			// type: subscriptionData['data']['object']['object'],
			// productId: subscriptionData['data']['object']['plan']['product'],
			// billingType: subscriptionData['data']['object']['plan']['interval'],
			// amount: subscriptionData['data']['object']['plan']['amount'],
			// currency: subscriptionData['data']['object']['plan']['currency'],
			// featuredType: checkplan['featuredType'],
			// userId: userData['_id'],
			// status: subscriptionData['data']['object']['status'],
			// subscriptionId: subscriptionData['data']['object']['id'],
			const data = {
				billingReason: invoice['data']['object']['billing_reason'],
				transactionId: invoice['data']['object']['charge'],
				// type: invoice['data']['object']['object'],
				productId: invoice['data']['object']['lines']['data'][0]['plan']['product'],
				billingType: invoice['data']['object']['lines']['data'][0]['plan']['interval'],
				amount: (invoice['data']['object']['lines']['data'][0]['amount'] / 100),
				currency: invoice['data']['object']['lines']['data'][0]['plan']['currency'],
				featuredType: checkplan['featuredType'],
				userId: userData['_id'],
				status: invoice['data']['object']['status'],
				// subscription:
				// subscriptionId: invoice['data']['object']['lines'][0]['subscription'],
				customer: invoice['data']['object']['customer'],
				customer_email: invoice['data']['object']['email'],
				receiptUrl: invoice['data']['object']['hosted_invoice_url'],
				paid: invoice['data']['object']['paid'],
			};
			console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data);

			const insertData = await this.DAOManager.saveData(this.modelName, data);
			return data;
		}
		catch (error) {
			return Promise.reject(error);
		}
	}
	// async updateTransactionStatus(payload, chargeData) {
	// 	try {
	// 		const query: any = {};
	// 		query._id = payload._id;

	// 		const set: any = {};
	// 		const update = {};
	// 		update['$set'] = set;
	// 		set.status = chargeData.status;
	// 		if (payload.subscriptionId) {
	// 			set.subscriptionId = payload.subscriptionId;
	// 		}
	// 		return await this.DAOManager.findAndUpdate(this.modelName, query, update);
	// 	} catch (error) {
	// 		utils.consolelog('Error', error, true);
	// 		return Promise.reject(error);
	// 	}
	// }

	async invoiceList(payload: TransactionRequest.InvoiceList, userData) {
		try {
			const { page, limit, featuredType, fromDate, toDate } = payload;

			const query: any = {};
			query.userId = Types.ObjectId(userData._id);
			// query.status = 'active';
			if (featuredType) {
				query['featuredType'] = featuredType;
			}
			if (fromDate && toDate) { query.createdAt = { $gte: fromDate, $lte: toDate }; }
			if (fromDate && !toDate) { query.createdAt = { $gte: fromDate }; }
			if (!fromDate && toDate) { query.createdAt = { $lte: toDate }; }

			const pipeline = [
				{ $match: query },
			];
			const data = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
			return data;
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async invoiceDetails(payload: TransactionRequest.Id) {
		try {
			const query: any = {};
			query._id = payload.transactionId;
			// const projection = { amount: 1, userId: 1, name: 1, address: 1, invoiceNo: 1, featuredType: 1, billingType: 1, paymentMethod: 1, createdAt: 1 };
			const response = await this.DAOManager.findOne(this.modelName, query, {});
			const populateQuery = [
				{ path: 'userId', model: 'User', select: 'email' },
			];
			return await this.DAOManager.populateDataOnAggregate(this.modelName, response, populateQuery);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}
}

export const TransactionE = new TransactionClass();
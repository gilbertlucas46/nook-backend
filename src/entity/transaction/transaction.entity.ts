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

	async addTransaction(payload: TransactionRequest.CreateCharge, userData, chargeData) {
		try {
			return await this.DAOManager.saveData(this.modelName, {
				transactionId: chargeData.balance_transaction,
				amount: payload.amount,
				currency: chargeData.currency,
				chargeId: chargeData.id,
				cardId: chargeData.source.id,
				receiptUrl: chargeData.receipt_url,
				description: chargeData.description,
				status: chargeData.status,
				userId: userData._id,
				featuredType: payload.featuredType,
				billingType: payload.billingType,
				paymentMethod: chargeData.payment_method_details.card.brand,
				paymentObject: chargeData,
			});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async updateTransactionStatus(payload, chargeData) {
		try {
			const query: any = {};
			query._id = payload._id;

			const set: any = {};
			const update = {};
			update['$set'] = set;
			set.status = chargeData.status;
			if (payload.subscriptionId) {
				set.subscriptionId = payload.subscriptionId;
			}

			return await this.DAOManager.findAndUpdate(this.modelName, query, update);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async invoiceList(payload: TransactionRequest.InvoiceList, userData) {
		try {
			const { page, limit, featuredType, fromDate, toDate } = payload;

			const query: any = {};
			query.userId = Types.ObjectId(userData._id);
			query.status = 'succeeded';
			if (featuredType) {
				query.featuredType = featuredType;
			}
			if (fromDate && toDate) { query.createdAt = { $gte: fromDate, $lte: toDate }; }
			if (fromDate && !toDate) { query.createdAt = { $gte: fromDate }; }
			if (!fromDate && toDate) { query.createdAt = { $lte: toDate }; }

			const pipeline = [
				{ $match: query },
				{
					$project: {
						invoiceNo: 1,
						createdAt: 1,
						description: 1,
						featuredType: 1,
						billingType: 1,
						paymentMethod: 1,
						amount: 1,
					},
				},
			];

			return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async invoiceDetails(payload: TransactionRequest.Id) {
		try {
			const query: any = {};
			query._id = payload.transactionId;

			let projection = { amount: 1, userId: 1, invoiceNo: 1, featuredType: 1, billingType: 1, paymentMethod: 1, createdAt: 1 };
			let response = await this.DAOManager.findOne(this.modelName, query, projection);
			let populateQuery = [
				{ path: 'userId', model: 'User', select: '_id firstName middleName lastName email address' },
			];
			return await this.DAOManager.populateDataOnAggregate(this.modelName, response, populateQuery);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}
}

export const TransactionE = new TransactionClass();
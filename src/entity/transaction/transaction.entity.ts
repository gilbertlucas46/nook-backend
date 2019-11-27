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
			const { page, limit, featuredType } = payload;

			const query: any = {};
			query.userId = Types.ObjectId(userData._id);
			query.status = 'succeeded';
			if (featuredType) {
				query.featuredType = featuredType;
			}

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
}

export const TransactionE = new TransactionClass();
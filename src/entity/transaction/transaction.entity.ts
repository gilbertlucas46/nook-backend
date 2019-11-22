'use strict';

import { Types } from 'mongoose';

import { BaseEntity } from '@src/entity/base/base.entity';
import { TransactionRequest } from '@src/interfaces/transaction.interface';
import * as utils from '@src/utils';

export class TransactionClass extends BaseEntity {

	constructor() {
		super('Transaction');
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
				paymentMethod: chargeData.payment_method_details.card.brand
			});
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async invoiceList(payload: TransactionRequest.InvoiceList, userData) {
		try {
			let { page, limit, featuredType } = payload;

			let query: any = {};
			query.userId = Types.ObjectId(userData._id);
			if (featuredType) {
				query.featuredType = featuredType;
			}

			const pipeline = [
				{ "$match": query },
				{
					"$project": {
						invoiceNo: 1,
						createdAt: 1,
						description: 1,
						featuredType: 1,
						billingType: 1,
						paymentMethod: 1,
						amount: 1
					}
				}
			];

			return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}
}

export const TransactionE = new TransactionClass();
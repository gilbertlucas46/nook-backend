import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants';
// import * as Stripe from 'stripe';

// const stripe = new Stripe('sk_test_bczq2IIJNuLftIaA79Al1wrx00jgNAsPiU');

export class TransactionClass extends BaseEntity {
    constructor() {
        super('Transaction');
    }
    async createTransaction() {
        try {

        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const TransactionE = new TransactionClass();
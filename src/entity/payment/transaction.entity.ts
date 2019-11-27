import { BaseEntity } from '@src/entity/base/base.entity';
export class TransactionClass extends BaseEntity {
    constructor() {
        super('Transaction');
    }
    async createTransaction() {
        try { }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
export const TransactionE = new TransactionClass();
import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';

class LoanApplicationE extends BaseEntity {
    constructor() {
        super('LoanApplication');
    }
    /**
     * @description saving loan application
     * @param payload
     */
    async saveLoanApplication(payload) {
        return this.createOneEntity(payload);
    }
    /**
     * @description saving loan application
     * @param payload
     */
    async updateLoanApplication(payload) {
        return this.updateOneEntity({ _id: Types.ObjectId(payload._id) }, { payload });
    }
}

export const LoanApplicationEntity = new LoanApplicationE();
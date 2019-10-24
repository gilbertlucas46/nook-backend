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

    async getRefrenceId(criteria) {
        return this.DAOManager.findOne(this.modelName, criteria, {}, { sort: { _id: - 1 }, limit: 1 });
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
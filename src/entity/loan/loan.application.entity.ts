import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';

class LoanApplicationE extends BaseEntity {
    constructor() {
        super('LoanApplication');
    }
    /**
     * @description saving loan application
     * @param payload
     */
    async saveLoanApplication(payload) {
        try {
            return await this.createOneEntity(payload);
        } catch (error) {
            console.log('Error in saving loan data ', error);
            return Promise.reject(error);
        }
    }
    /**
     * @description saving loan applicationu
     * @param payload
     */
    async updateLoanApplication(payload) {
        return this.updateOneEntity({ _id: Types.ObjectId(payload._id) }, { payload });
    }

    async getReferenceId(criteria) {
        const data = await this.DAOManager.findAll(this.modelName, criteria, {}, { sort: { _id: - 1 }, limit: 1 });
        return data[0];
    }

    async getUserLoanList(payload, userData) {
        try {
            let { page, limit, sortType } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            // let sortingType = {};

            // sortingType = {
            //     createdAt: sortType,
            // }; sort: sortingType

            // const { limit, skip } = payload;
            const criteria = {
                userId: userData._id,
            };
            const data = await this.DAOManager.findAll(this.modelName, criteria, {}, { skip, limit: 10 });
            return data;
        } catch (error) {
            console.log('Error in saving loan data ', error);
            return Promise.reject(error);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
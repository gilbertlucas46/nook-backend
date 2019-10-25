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
        return this.createOneEntity(payload);
    }
    /**
     * @description saving loan applicationu
     * @param payload
     */
    async updateLoanApplication(payload) {
        return this.updateOneEntity({ _id: Types.ObjectId(payload._id) }, { payload });
    }

    async getRefrenceId(criteria) {
        return this.DAOManager.findOne(this.modelName, criteria, {}, { sort: { _id: - 1 }, limit: 1 });
    }

    async getUserLoanList(payload, userData) {
        try {
            let { page, limit, sortType } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};

            // sortingType = {
            //     createdAt: sortType,
            // }; sort: sortingType

            // const { limit, skip } = payload;
            const criteria = {
                userId: userData._id,
            };
            const data = await this.DAOManager.findAll(this.modelName, criteria, {}, { skip: skip, limit: 10 })
            console.log('switch (sortBy)', data);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
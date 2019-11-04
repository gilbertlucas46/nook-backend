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
            console.log('payloadpayload', payload);

            let { page, limit, sortType } = payload;
            const { fromDate, toDate } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            const sortingType = {};
            const promiseArray = [];
            const query = {
                userId: userData._id,
            };

            // sortingType = {
            //     createdAt: sortType,
            // }; sort: sortingType

            if (fromDate && toDate) {
                query['createdAt'] = {
                    $gte: fromDate,
                    $lte: toDate,
                };
            }
            else if (toDate) {
                query['createdAt'] = {
                    $lte: toDate,
                };
            } else if (fromDate) {
                query['createdAt'] = {
                    $gte: fromDate,
                    $lte: new Date().getTime(),
                };
            }

            // const { limit, skip } = payload;
            // query = {
            //     userId: userData._id,
            // };
            promiseArray.push(this.DAOManager.findAll(this.modelName, query, {}, { skip: skip, limit: limit }))
            promiseArray.push(this.DAOManager.count(this.modelName, query));
            const [data, total] = await Promise.all(promiseArray);
            return {
                data,
                total,
            };
         } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
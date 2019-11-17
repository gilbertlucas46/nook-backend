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
        return this.updateOneEntity({ _id: Types.ObjectId(payload.loanId) }, payload);
    }

    async getReferenceId(criteria) {
        const data = await this.DAOManager.findAll(this.modelName, criteria, {}, { sort: { _id: - 1 }, limit: 1 });
        return data[0];
    }

    async getUserLoanList(payload, userData) {
        try {
            let { page, limit, sortType, sortBy } = payload;
            const { fromDate, toDate, status } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const promiseArray = [];
            let matchObject: any = {};
            if (userData.type === 'TENANT' || userData.type === 'OWNER' || userData.type === 'AGENT') {
                matchObject = {
                    userId: userData._id,
                };
            }
            else {
                matchObject['saveAsDraft'] = false;
                // saveAsDraft: false,
            }

            if (sortBy) {
                // switch (sortBy) {
                // case 'Date':
                sortBy = 'Date';
                sortingType = {
                    createdAt: sortType,
                };
                // break;
                // default:
                //     sortBy = 'createdAt';
                //     sortingType = {
                //         updatedAt: sortType,
                //     };
                //     break;
                // }
            }

            if (status) {
                matchObject['applicationStatus'] = status;
            }
            else {
                matchObject['applicationStatus'] = {
                    $or: [
                        Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
                        Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
                        Constant.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
                    ],
                };
            }

            // sortingType = {
            //     createdAt: sortType,
            // }; sort: sortingType

            if (fromDate && toDate) {
                matchObject['createdAt'] = {
                    $gte: fromDate,
                    $lte: toDate,
                };
            }
            else if (toDate) {
                matchObject['createdAt'] = {
                    $lte: toDate,
                };
            } else if (fromDate) {
                matchObject['createdAt'] = {
                    $gte: fromDate,
                    $lte: new Date().getTime(),
                };
            }

            promiseArray.push(this.DAOManager.findAll(this.modelName, matchObject, {}, { skip, limit }));
            promiseArray.push(this.DAOManager.count(this.modelName, matchObject));
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
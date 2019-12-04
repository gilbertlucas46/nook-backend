import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as utils from '@src/utils';

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
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @description saving loan applicationu
     * @param payload
     */
    async updateLoanApplication(payload) {
        try {
            return this.updateOneEntity({ _id: Types.ObjectId(payload.loanId) }, payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getReferenceId(criteria) {
        try {
            const data = await this.DAOManager.findAll(this.modelName, criteria, {}, { sort: { _id: - 1 }, limit: 1 });
            return data[0];
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserLoanList(payload: LoanRequest.IGetUserLoanList, userData) {
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
                matchObject['applicationStatus'] = { $ne: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value };
                // saveAsDraft: false,
            }

            if (sortBy) {
                // switch (sortBy) {
                // case 'Date':
                // sortBy = 'Date';
                // sortingType = {
                //     createdAt: sortType,
                // };

            } else {
                sortBy = 'Date';
                sortingType = {
                    createdAt: sortType,
                };
            }

            if (status) {
                matchObject['applicationStatus'] = status;
            }

            else {
                matchObject['$or'] = [
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value },
                ];
            }

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

            promiseArray.push(this.DAOManager.findAll(this.modelName, matchObject, {}, { skip, limit, sort: sortingType }));
            promiseArray.push(this.DAOManager.count(this.modelName, matchObject));
            const [data, total] = await Promise.all(promiseArray);
            return {
                data,
                total,
            };
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getAdminLoanList(payload: LoanRequest.IGetUserLoanList, userData) {
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
                matchObject['applicationStatus'] = { $ne: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value };
                // saveAsDraft: false,
            }

            if (sortBy) {
                // switch (sortBy) {
                // case 'Date':
                // sortBy = 'Date';
                // sortingType = {
                //     createdAt: sortType,
                // };

            } else {
                sortBy = 'Date';
                sortingType = {
                    createdAt: sortType,
                };
            }

            if (status) {
                matchObject['applicationStatus'] = status;
            }

            else {
                matchObject['$or'] = [
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value },
                    // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value },
                    { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value },
                ];
            }

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

            promiseArray.push(this.DAOManager.findAll(this.modelName, matchObject, {}, { skip, limit, sort: sortingType }));
            promiseArray.push(this.DAOManager.count(this.modelName, matchObject));
            const [data, total] = await Promise.all(promiseArray);
            return {
                data,
                total,
            };
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
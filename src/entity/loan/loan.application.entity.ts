import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as utils from '@src/utils';
import * as config from 'config';
import fetch from 'node-fetch';
import { flattenObject } from '@src/utils';

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
            const data = await this.createOneEntity(payload);
            // send data to sales-force
            this.sendApplication(data);
            return data;
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
            const data = await this.updateOneEntity({ _id: Types.ObjectId(payload.loanId) }, payload);
            // send data to sales-force
            this.sendApplication(data);
            return data;
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
            // else {
            //     matchObject['saveAsDraft'] = false;
            //     matchObject['applicationStatus'] = { $ne: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value };
            //     // saveAsDraft: false,
            // }

            sortingType = {
                [sortBy]: sortType,
            };
            // switch (sortBy) {
            // case 'Date':
            // sortBy = 'Date';
            // sortingType = {
            //     createdAt: sortType,
            // };

            //  else {
            //     sortBy = 'Date';
            //     sortingType = {
            //         createdAt: sortType,
            //     };
            // }

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

    async getAdminLoanList(payload: LoanRequest.IGetAdminLoanList, userData) {
        try {
            let { page, limit, sortType } = payload;
            const { fromDate, toDate, status, sortBy, amountFrom, amountTo, searchTerm } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const promiseArray = [];
            const matchObject: any = {};

            // if (userData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE || userData.type === Constant.DATABASE.USER_TYPE.ADMIN.TYPE) {
            // matchObject['saveAsDraft'] = false;
            // }

            if (sortBy) {
                sortingType = {
                    [sortBy]: sortType,
                };
            }
            if (status) {
                matchObject['applicationStatus'] = status;
            }
            else {
                matchObject['applicationStatus'] =
                    { $ne: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value };
            }

            if (amountFrom && amountTo) {
                matchObject['loanDetails.loanAmount'] = {
                    $gt: amountFrom,
                    $lt: amountTo,
                };
            } else if (amountFrom && !amountTo) {
                matchObject['loanDetails.loanAmount'] = {
                    $gt: amountFrom,
                };
            } else if (amountTo && !amountFrom) {
                matchObject['loanDetails.loanAmount'] = {
                    $lt: amountTo,
                };
            }
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value },
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value },
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value },
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value },
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value },
            // { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value },

            // ];
            // }
            if (searchTerm) {
                matchObject['$or'] = [
                    { 'personalInfo.firstName': { $regex: searchTerm, $options: 'i' } },
                    { 'personalInfo.middleName': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.phoneNumber': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.email': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.mobileNumber': { $regex: searchTerm, $options: 'i' } },
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
    /**
     * @description A Function to map and send application data to sales-force
     * @param data Application Data
     */
    async sendApplication(data) {
        // console.log('inside Loan');
        if (data.applicationStatus === Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value) {
            const salesforceData: {[key: string]: string | number} = flattenObject(data.toObject ? data.toObject() : data);
            await fetch(config.get('zapier_loanUrl'), {
                method: 'post',
                body: JSON.stringify(salesforceData),
            });
            // console.log(config.get('zapier_loanUrl'), salesforceData);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();
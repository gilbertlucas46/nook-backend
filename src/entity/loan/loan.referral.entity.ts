import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanReferralDocument } from '@src/models/referral';
import * as Constant from '@src/constants';
import { loanReferralRequest } from '@src/interfaces/loanReferral.interface';
import * as utils from 'src/utils';
class LoanReferral extends BaseEntity {
    constructor() {
        super('LoanReferral');
    }
    async createReferral(payload) {
        try {
            return await this.DAOManager.save<LoanReferralDocument>(this.modelName, payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getReferral(payload) {
        try {
            return await this.DAOManager.getData1<LoanReferralDocument>(this.modelName, payload, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserReferral(payload: loanReferralRequest.IUserLoanRefferal, userData) {
        try {
            const pipeline = [];
            let { page, limit, sortType } = payload;
            const { sortBy, searchTerm } = payload;
            let query: any = {};
            if (!searchTerm) {
                query = {
                    userId: userData._id,
                };
            }
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const skip = (limit * (page - 1));
            const promiseArray = [];
            sortingType = {
                [sortBy]: sortType,
            };
            // const criteria = {
            //     userId: userData._id,
            // };
            if (searchTerm) {
                query = {
                    $or: [
                        { firstName: { $regex: searchTerm, $options: 'i' } },
                        { lastName: { $regex: searchTerm, $options: 'i' } },
                        { email: { $regex: searchTerm, $options: 'i' } },
                        { phoneNumber: { $regex: searchTerm, $options: 'i' } },
                        { notes: { $regex: searchTerm, $options: 'i' } },
                    ],
                };

                promiseArray.push(this.DAOManager.findAll(this.modelName, query, {}, { limit, skip, sort: sortingType }));
                promiseArray.push(this.DAOManager.count(this.modelName, query));
                const [data, total] = await Promise.all(promiseArray);
                return {
                    data, total,
                };
            }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

}

export const ReferalE = new LoanReferral();
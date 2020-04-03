import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanRequest } from './../../interfaces/loan.interface';
import * as Constant from '@src/constants';
import { NATIONALITY } from '@src/constants';
import { Types } from 'mongoose';
import * as utils from '@src/utils';

class PreLoanEntities extends BaseEntity {
    constructor() {
        super('PreQualification');
    }

    async preloanList(payload, adminData) {
        try {
            // const paginateOptions = {
            //     page: page || 1,
            //     limit: limit || Constant.SERVER.LIMIT,
            // };
            const { userId, sortType } = payload;
            console.log('userIduserIduserId', userId);

            const paginateOptions = {
                page: 1,
                limit: 1, // Constant.SERVER.LIMIT,
            };
            const sortingType = {
                _id: sortType,
            };
            const query = {
                userId: Types.ObjectId(userId),
            };

            const matchPipeline = [
                {
                    $match: query,
                },
                { $sort: sortingType },
            ];
            // const pipeline = [
            //     {
            //         $lookup: 'users',
            //         from: '',
            //     },
            // ];
            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            // const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            const data = await this.DAOManager.aggregateData(this.modelName, matchPipeline)
            console.log('datadatadatadatadatadatadata', data);
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export const PreQualificationBankE = new PreLoanEntities();

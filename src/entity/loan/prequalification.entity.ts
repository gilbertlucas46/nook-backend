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
            const { fromDate, toDate, status, propertyValue, propertyType } = payload;
            // const paginateOptions = {
            //     page: page || 1,
            //     limit: limit || Constant.SERVER.LIMIT,
            // };
            const matchObject: any = {};

            const { sortType } = payload;
            // console.log('userIduserIduserId', userId);

            const paginateOptions = {
                page: 1,
                limit: 1, // Constant.SERVER.LIMIT,
            };
            const sortingType = {
                _id: sortType,
            };


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
            if (propertyValue) {
                matchObject['propertyValue'] = {
                    propertyValue,
                };
            }
            if (propertyType) {
                matchObject['propertyType'] = {
                    propertyType,
                };
            }
            // const query = {
            //     userId: Types.ObjectId(userId),
            // };

            const matchPipeline = [
                {
                    $match: matchObject,
                },
                // { $sort: sortingType },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // prequalifiedBanks: 0,
                        propertyValue: 0,
                        propertyType: '0',
                        refrenceId: 'PQ-1111',
                        No_Of_Banks: { $size: '$prequalifiedBanks' },
                    }
                }
            ];
            // const pipeline = [
            //     {
            //         $lookup: 'users',
            //         from: '',
            //     },
            // ];
            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            // const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            const data = await this.DAOManager.aggregateData(this.modelName, matchPipeline);
            console.log('datadatadatadatadatadatadata', data);
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }


    async preLoanDetail(payload) {
        try {
            const query = {
                _id: payload.id,
            }
            const data = await this.DAOManager.findOne(this.modelName, query, {});
            console.log('dataaaaa', data);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const PreQualificationBankE = new PreLoanEntities();

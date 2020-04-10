import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanRequest } from './../../interfaces/loan.interface';
import * as Constant from '@src/constants';
import { NATIONALITY } from '@src/constants';
import { Types } from 'mongoose';
import * as utils from '@src/utils';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';

class PreLoanEntities extends BaseEntity {
    constructor() {
        super('PreQualification');
    }

    async addBanks(payload: PreQualificationRequest.IPreLoanAdd, userData) {
        try {
            console.log('payload>>>>>>>>>>>>>>>', payload);

            let totalMonthlyIncome = payload.work.income;
            let preLoanMonthlyAmount = 0;
            if (payload.other.married.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.married.spouseMonthlyIncome; // If married need to add spouse income also to calculate debtToIncomeRatio
            if (payload.other.coBorrower.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.coBorrower.coBorrowerMonthlyIncome; // If coborrower need to add coborrower income
            if (payload.other.otherIncome.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.otherIncome.monthlyIncome; // If any investment exists than that is also added in the income part.
            // if other loans exits
            if (payload.other.prevLoans.status) preLoanMonthlyAmount = payload.other.prevLoans.monthlyTotal;
            // if (payload.other.creditCard.status === Constant.CREDIT_CARD_STATUS.YES.value && payload.other.creditCard.limit > 0) {
            //     preLoanMonthlyAmount = preLoanMonthlyAmount + payload.other.creditCard.limit;
            // }

            let localVisa = false;
            let ageAtlastLoanPayment = 0;
            if (payload.other.nationality === NATIONALITY.FILIPINO.value) localVisa = true;
            if (payload.other.nationality === NATIONALITY.FOREIGNER.value && payload.other.localVisa === true) localVisa = true;

            // age filters
            if (payload.other.age) ageAtlastLoanPayment = payload.other.age + payload.loan.term;
            if (ageAtlastLoanPayment >= 65) return []; // Max age is 65 till the final loan payment.

            const queryPipeline = [];
            if (payload.other.creditCard.cancelled) {
                queryPipeline.push(
                    {
                        $match: {
                            loanForCancelledCreditCard: true,
                            loanMinAmount: { $lte: payload.property.value },
                            minMonthlyIncomeRequired: { $lte: totalMonthlyIncome },
                            loanForForeignerMarriedLocal: localVisa,
                            propertySpecification: {
                                $elemMatch: {
                                    $and: [
                                        { allowedPropertyType: payload.property.type },
                                        { allowedPropertyStatus: payload.property.status },
                                        { maxLoanDurationAllowed: { $gte: payload.loan.term } },
                                        { maxLoanPercent: { $gte: payload.loan.percent } },
                                    ],
                                },
                            },
                        },
                    },
                );
            } else {
                queryPipeline.push(
                    {
                        $match: {
                            loanMinAmount: { $lte: payload.property.value },
                            minMonthlyIncomeRequired: { $lte: totalMonthlyIncome },
                            loanForForeignerMarriedLocal: localVisa,
                            propertySpecification: {
                                $elemMatch: {
                                    $and: [
                                        { allowedPropertyType: payload.property.type },
                                        { allowedPropertyStatus: payload.property.status },
                                        { maxLoanDurationAllowed: { $gte: payload.loan.term } },
                                        { maxLoanPercent: { $gte: payload.loan.percent } },
                                    ],
                                },
                            },
                        },
                    },
                );
            }

            if (payload.bankId) queryPipeline[0].$match._id = Types.ObjectId(payload.bankId);

            queryPipeline.push(
                {
                    $lookup: {
                        from: 'userloancriterias',
                        let: { bank_Id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$bankId', '$$bank_Id'],
                                    },
                                },
                            },
                            // {
                            //     $project: {
                            //         name: 1,
                            //         _id: 1,
                            //     },
                            // },
                        ],
                        as: 'userloan',
                    },
                },
                {
                    $unwind: {
                        path: '$userloan',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        // Used different $match basically to handle some other conditions. will optimize later once we get the complete requirement.
                        // need to apply conditions based based on total income of borrower spouse(ifAny) and coborrower(ifAny) and the total assets(ifAny)
                        'userloan.loanForEmploymentType': {
                            $elemMatch: {
                                $and: [
                                    { employmentType: payload.work.type },
                                    { employmentRank: payload.work.rank },
                                    { minEmploymentTenure: { $lte: Constant.EMPLOYMENT_TENURE[`${payload.work.tenure}`].value.min } },
                                ],
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        interestRate: `$interestRateDetails.${payload.loan.fixingPeriod}`,
                        loanableAmount: payload.loan.amount,
                        loanDurationYearly: payload.loan.term,
                        loanApplicationFeeAmount: 0,
                        fixingPeriod: payload.loan.fixingPeriod,
                        grossIncome: totalMonthlyIncome,
                    },
                },
                {
                    $addFields: {
                        interestRateMonthly: { $divide: [{ $divide: ['$interestRate', 100] }, 12] },
                        loanDurationMonthly: { $multiply: [payload.loan.term, 12] },
                    },
                },
                {
                    $addFields: {
                        numerator1: { $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] },
                        denominator: { $subtract: [{ $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] }, 1] },
                    },
                },
                {
                    $addFields: {
                        numerator: { $multiply: ['$numerator1', '$interestRateMonthly', payload.loan.amount] },
                    },
                },
                {
                    $project: {
                        abbrevation: 1,
                        totalPrice: 1,
                        bankName: 1,
                        headquarterLocation: 1,
                        bankFeePercent: 'up to 2%',
                        propertySpecification: 1,
                        bankFeeAmount: 1,
                        loanApplicationFeePercent: 1,
                        loanApplicationFeeAmount: 1,
                        // bankImageLogoUrl: 1,
                        logoUrl: 1,
                        iconUrl: 1,
                        bannerUrl: 1,
                        processingTime: 'As fast as 5 working days upon submission of complete documents',
                        interestRate: 1,
                        loanDuration: 1,
                        totalLoanMonthly: { $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount] },
                        monthlyPayment: { $divide: ['$numerator', '$denominator'] },
                        totalLoanPayment: 1,
                        bankId: '$_id',
                        _id: 0,
                        loanableAmount: 1,
                        loanDurationYearly: 1,
                        loanDurationMonthly: 1,
                        loanForCancelledCreditCard: 1,
                        fixingPeriod: 1,
                        grossIncome: 1,
                        // userId: {
                        //     $let: {
                        //         vars: {
                        //             userData,
                        //         },
                        //         in: userData._id,
                        //     },
                        // },
                    },
                },
                {
                    $addFields: {
                        debtIncomePercentRatio: { $divide: [{ $multiply: ['$totalLoanMonthly', 100] }, totalMonthlyIncome] },
                    },
                },
                {
                    $unwind: {
                        path: '$propertySpecification',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        'propertySpecification.allowedPropertyType': 'APARTMENT',
                        'propertySpecification.allowedPropertyStatus': 'FORECLOSED',
                    },
                },
                {
                    $addFields: {
                        debtIncomeRatio: '$propertySpecification.debtIncomeRatio',
                        maxLoanDurationAllowed: '$propertySpecification.maxLoanDurationAllowed',
                    },
                },
                {
                    $project: {
                        propertySpecification: 0,
                    },
                },
                {
                    $match: {
                        $expr: {
                            $gte: ['$debtIncomeRatio', '$debtIncomePercentRatio'],
                        },
                    },
                },
                {
                    $sort: {
                        monthlyPayment: 1,
                    },
                },
            );

            const data = await this.DAOManager.aggregateData('Bank', queryPipeline);
            console.log('data>>>>>>>>>>>>>>>>>>>>>>>', data);

            if (data.length > 0) {
                // const getPreQualficationId =await

                payload['userId'] = userData._id;
                const criteria1 = ({
                    createdAt: {
                        $gte: new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
                    },
                });

                const referenceNumber = await this.getReferenceId(criteria1);
                console.log('referenceNumberreferenceNumber', referenceNumber);

                if (!referenceNumber) {
                    const year = new Date(new Date().getTime()).getFullYear().toString().substr(-2);
                    const month = ('0' + (new Date(new Date().getTime()).getMonth() + 1)).slice(-2);
                    const date = ('0' + (new Date(new Date().getTime()).getDate())).slice(-2);
                    const referenceId = 1;
                    const formattedTime = Constant.SERVER.PQ + '-' + year + month + date + '-' + Constant.SERVER.LOAN_PRE__ZEOS + referenceId;
                    payload['referenceId'] = formattedTime;
                } else {
                    // const year = new Date(referenceNumber.createdAt).getFullYear().toString().substr(-2);
                    // const month = (new Date(referenceNumber.createdAt).getMonth() + 1).toString().substr(-2);
                    // const date = ('0' + new Date(referenceNumber.createdAt).getDate()).slice(-2);  //.toString().substr(-2);
                    const id = referenceNumber['referenceId'].split('-')[2];
                    let num = (parseInt(id) + 1).toString();
                    if (num.length < 4) {
                        const remainingChars = 4 - num.length;
                        for (let i = 0; i < remainingChars; i++) {
                            num = '0' + num;
                        }
                    }
                    // const num = await this.addOne(id);
                    const formattedTime = referenceNumber['referenceId'].replace(referenceNumber['referenceId'].split('-')[2], num);
                    payload['referenceId'] = formattedTime;
                }

                const dataToSave = {
                    ...payload,
                    userId: userData._id,
                    prequalifiedBanks: data,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                };

                const a = this.DAOManager.insert(this.modelName, dataToSave);
                console.log('daaaaaaaaaaaaaaaaaaaa', a);
            }
            return data;
        } catch (error) {
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

    async preloanList(payload, adminData) {
        try {
            const { fromDate, toDate, status, propertyValue, propertyType, page, limit, searchTerm } = payload;
            // const paginateOptions = {
            //     page: page || 1,
            //     limit: limit || Constant.SERVER.LIMIT,
            // };
            const matchObject: any = {};
            let searchObject: any = {};
            const { sortType } = payload;
            // console.log('userIduserIduserId', userId);

            const paginateOptions = {
                page: page || 1,
                limit: limit || Constant.SERVER.LIMIT,
            };
            const sortingType = {
                _id: sortType,
            };

            if (searchTerm) {
                searchObject = {
                    $or: [
                        { referenceId: { $regex: searchTerm } },
                    ],
                };
            } else {
                searchObject = {

                };
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
                {
                    $match: searchObject,
                },
                // { $sort: sortingType },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // prequalifiedBanks: 0,
                        propertyValue: '$property.type',
                        propertyType: '$property.value',
                        referenceId: 1,
                        No_Of_Banks: { $size: '$prequalifiedBanks' },
                    },
                },
            ];
            // const pipeline = [
            //     {
            //         $lookup: 'users',
            //         from: '',
            //     },
            // ];
            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            // const data = await this.DAOManager.aggregateData(this.modelName, matchPipeline, paginateOptions.limit, paginateOptions.skip);
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
            };
            const data = await this.DAOManager.findOne(this.modelName, query, {});
            console.log('dataaaaa', data);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async userPreLoanList(payload, userData) {
        try {
            const { fromDate,
                toDate,
                limit = Constant.SERVER.LIMIT,
                page = 1,
            } = payload;
            const skip = (limit * (page - 1));

            const paginateOptions = {
                page: page || 1,
                limit: limit || Constant.SERVER.LIMIT,
            }

            const matchCondition: any = {};
            if (fromDate && toDate) { matchCondition['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchCondition['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchCondition['createdAt'] = { $lte: toDate }; }

            matchCondition['userId'] = userData._id;

            const matchPipeline = [
                {
                    $match: matchCondition,
                },
                // { $sort: sortingType },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // prequalifiedBanks: 0,
                        propertyValue: '$property.type',
                        propertyType: '$property.value',
                        referenceId: 1,
                        No_Of_Banks: { $size: '$prequalifiedBanks' },
                    },
                },
            ];
            // const pipeline = [
            //     {
            //         $lookup: 'users',
            //         from: '',
            //     },
            // ];
            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export const PreQualificationBankE = new PreLoanEntities();
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanRequest } from './../../interfaces/loan.interface';
import * as Constant from '@src/constants';
import { NATIONALITY } from '@src/constants';
import { Types } from 'mongoose';
import { flattenObject } from '@src/utils';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';
import fetch from 'node-fetch';
import * as config from 'config';
import { ObjectId } from 'bson';

class PreLoanEntities extends BaseEntity {
    constructor() {
        super('PreQualification');
    }

    async addBanks(payload: PreQualificationRequest.IPreLoanAdd, userData) {
        try {
            let totalMonthlyIncome = payload.employmentInfo.income;
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
            // if (ageAtlastLoanPayment >= 65) return []; // Max age is 65 till the final loan payment.
            if (ageAtlastLoanPayment >= 70) return []; // Max age is 65 till the final loan payment.

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
            if (ageAtlastLoanPayment > 65 && ageAtlastLoanPayment < 70) {
                queryPipeline.push({
                    $match: {
                        maxAgeRequiredForLoan: { $eq: 70 },
                    },
                });
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
                                    { employmentType: payload.employmentInfo.type },
                                    { employmentRank: payload.employmentInfo.rank },
                                    { minEmploymentTenure: { $lte: Constant.EMPLOYMENT_TENURE[`${payload.employmentInfo.tenure}`].value.min } },
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
                        // totalLoanMonthly: { $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount] },
                        // monthlyPayment: { $divide: ['$numerator', '$denominator'] },
                        totalLoanMonthly: { $round: [{ $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount] }, 2] },
                        monthlyPayment: {
                            $round: [{ $divide: ['$numerator', '$denominator'] }, 2],
                        },
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
                // {
                //     $addFields: {
                //         debtIncomePercentRatio: { $round: [{ $divide: [{ $multiply: ['$totalLoanMonthly', 100] }, totalMonthlyIncome] }, 2] },
                //     },
                // },
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
            if (data.length > 0) {
                // const getPreQualficationId =await
                payload['grossIncome'] = totalMonthlyIncome;
                payload['totalLoanMonthly'] = data[0]['totalLoanMonthly'];
                payload['monthlyPayment'] = data[0]['monthlyPayment'];

                if (payload.preQualificationId) {
                    const criteria = {
                        _id: payload.preQualificationId,
                        // userId: userData._id,
                    };
                    const dataToUpate = {
                        ...payload,
                        prequalifiedBanks: data,
                        // createdAt: new Date().getTime(),
                        // updatedAt: new Date().getTime(),
                    };

                    const updatedData = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpate);
                    const salesforceData: { [key: string]: string | number } = flattenObject(updatedData.toObject ? updatedData.toObject() : updatedData);
                    console.log('zapier_loanUrlzapier_loanUrl', config.get('zapier_loanUrl'), config.get('environment'));
                    console.log('salesforceDatasalesforceDatasalesforceData', salesforceData);

                    fetch(config.get('zapier_prequalificationUrl'), {
                        method: 'post',
                        body: JSON.stringify(salesforceData),
                    });


                    return updatedData ? updatedData : {};
                }

                payload['userId'] = payload.userId ? payload.userId : userData._id;
                const criteria1 = ({
                    createdAt: {
                        $gte: new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
                    },
                });

                const referenceNumber = await this.getReferenceId(criteria1);

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
                    email: (payload.other && payload.other.email) ? payload.other.email : userData.email,
                    userId: payload.userId ? payload.userId : userData._id,
                    prequalifiedBanks: data,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime(),
                };

                if (payload.partnerId && payload.partnerName) {
                    const criteria = {
                        shortId: payload.partnerId,
                    }
                    this.DAOManager.findAndUpdate('Partner', criteria, { $inc: { totalPrequalification: 1 } });
                }
                const data1 = await this.DAOManager.insert(this.modelName, dataToSave);
                // console.log('data1.work: ', data1.work);

                // data1 = data1.toObject();
                // data1['employmentInfo'] = data1.work;
                // data1.employmentInfo.grossMonthlyIncome = data1.work.income;
                // delete data1['work'];
                // console.log('data2:', data1);
                if (payload.other && payload.other.email) {
                    delete payload.other['email'];
                }
                function GetFormattedDate(date) {
                    const todayTime = new Date(date);
                    const month = (todayTime.getMonth() + 1);
                    const day = (todayTime.getDate());
                    const year = (todayTime.getFullYear());
                    console.log("day + ' - ' + month + ' - ' + year", day + '-' + month + '-' + year);
                    return day + '-' + month + '-' + year;
                }

                // for salesfoce 
                if (payload.other && payload.other.dob) {
                    payload.other.dob = GetFormattedDate(payload.other['dob'])
                }


                const salesforceData: { [key: string]: string | number } = flattenObject(data1.toObject ? data1.toObject() : data1);
                console.log('zapier_loanUrlzapier_loanUrl', config.get('zapier_loanUrl'), config.get('environment'));
                console.log('salesforceDatasalesforceDatasalesforceData', salesforceData);

                fetch(config.get('zapier_prequalificationUrl'), {
                    method: 'post',
                    body: JSON.stringify(salesforceData),
                });

                return data1['_id'];
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
            return Promise.reject(error);
        }
    }

    async preloanList(payload: PreQualificationRequest.IAdminPrequalificationList, adminData) {
        try {
            const { fromDate, toDate, propertyValue, propertyType, page, limit, searchTerm, partnerId } = payload;
            // const paginateOptions = {
            //     page: page || 1,
            //     limit: limit || Constant.SERVER.LIMIT,
            // };
            const matchObject: any = {};
            let searchObject: any = {};
            const { sortType } = payload;

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
                matchObject['property.value'] = propertyValue;
            }
            if (propertyType) {
                matchObject['property.type'] = propertyType;
            }
            if (partnerId) {
                matchObject['partnerId'] = partnerId;
            }
            // const query = {
            //     userId: Types.ObjectId(userId),
            // };

            const matchPipeline = [
                {
                    $match: matchObject,
                },
                {
                    $sort: sortingType,
                },
                {
                    $match: searchObject,
                },
            ];
            // { $sort: sortingType },
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        let: { uid: '$userId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid'],
                                    },
                                },
                            },
                        ],
                        as: 'userData',
                    },
                },
                {
                    $unwind: {
                        path: '$userData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        partnerId: 1,
                        partnerName: 1,
                        propertyValue: '$property.value',
                        propertyType: '$property.type',
                        referenceId: 1,
                        firstName: {
                            $cond: {
                                if: '$userData.firstName',
                                then: '$userData.firstName',
                                else: '$other.firstName',
                            },
                        },
                        lastName: {
                            $cond: {
                                if: '$userData.lastName',
                                then: '$userData.lastName',
                                else: '$other.lastName',
                            },
                        },
                        middleName: {
                            $cond: {
                                if: '$userData.firstName',
                                then: '$userData.middleName',
                                else: '$other.middleName',
                            },
                        },
                        userName: {
                            $cond: {
                                if: '$userData.userName',
                                then: '$userData.userName',
                                else: '$other.userName',
                            },
                        },
                        email: {
                            $cond: {
                                if: '$userData.email',
                                then: '$userData.email',
                                else: '$other.email',
                            },
                        },
                        No_Of_Banks: {
                            $size: '$prequalifiedBanks',
                        },
                    },
                },
            ];

            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, pipeline).aggregate(this.modelName);
            // const data = await this.DAOManager.aggregateData(this.modelName, matchPipeline, paginateOptions.limit, paginateOptions.skip);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async preLoanDetail(payload: PreQualificationRequest.IprequalificationDetail) {
        try {
            const query = {
                _id: payload.id,
            };
            // const data = await this.DAOManager.findOne(this.modelName, query, {});
            const aggregate = [
                {
                    $match: {
                        _id: Types.ObjectId(payload.id),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { uid: '$userId' },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $eq: [
                                        '$_id', '$$uid',
                                    ],
                                },
                            },
                        },
                        ],
                        as: 'userdata',
                    },
                },
                {
                    $unwind: {
                        path: '$userdata',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const data = await this.DAOManager.aggregateData(this.modelName, aggregate);
            if (!data) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.DEFAULT);
            }
            return data[0] ? data[0] : {};

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
            };

            const matchCondition: any = {};
            if (fromDate && toDate) { matchCondition['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchCondition['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchCondition['createdAt'] = { $lte: toDate }; }

            matchCondition['userId'] = Types.ObjectId(userData._id);

            const matchPipeline = [
                {
                    $match: matchCondition,
                },
                {
                    $sort: {
                        _id: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // prequalifiedBanks: 0,
                        propertyValue: '$property.value',
                        propertyType: '$property.type',
                        referenceId: 1,
                        No_Of_Banks: { $size: '$prequalifiedBanks' },
                    },
                },
            ];
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        let: { uid: '$userId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$uid'],
                                    },
                                },
                            },
                        ],
                        as: 'userData',
                    },
                },
                {
                    $unwind: {
                        path: '$userData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        // prequalifiedBanks: 0,
                        propertyValue: '$property.value',
                        propertyType: '$property.type',
                        referenceId: 1,
                        firstName: '$userData.firstName',
                        lastName: '$userData.lastName',
                        middleName: '$userData.middleName',
                        userName: '$userData.userName',
                        No_Of_Banks: { $size: '$prequalifiedBanks' },
                    },
                },
            ];
            // const data = this.DAOManager.paginatePipeline(this.modelName, query);
            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export const PreQualificationBankE = new PreLoanEntities();

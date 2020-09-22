import { BaseEntity } from '@src/entity/base/base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as utils from '@src/utils';
import * as config from 'config';
import fetch from 'node-fetch';
import { flattenObject } from '@src/utils';
import { label } from 'joi';
import * as UniversalFunctions from '@src/utils';
import { type } from 'os';

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
            if (payload.partnerId && payload.partnerName) {
                const criteria = {
                    shortId: payload.partnerId,
                };
                this.DAOManager.findAndUpdate('Partner', criteria, { $inc: { totalLoanApplication: 1 } });
            }
            const data = await this.createOneEntity(payload);
            // send data to sales-force

            const salesforce = await this.sendApplication(data);

            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            utils.errorReporter(error)
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
            await this.sendApplication(data);

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
            let { page, limit, sortType, sortBy, partnerId } = payload;
            const { fromDate, toDate, status } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const promiseArray = [];
            let matchObject: any = {};
            if (userData._id) {
                matchObject = {
                    userId: userData._id,
                };
            }

            sortingType = {
                createdAt: sortType,
            };
            matchObject['status'] = Constant.DATABASE.STATUS.LOAN_STATUS.ACTIVE;
            if (status) {
                matchObject['applicationStatus'] = status;
            }

            // else {
            //     matchObject['$or'] = [
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value },
            //         { applicationStatus: Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value },
            //     ];
            // }

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
            if (partnerId) {
                matchObject['partnerId'] = partnerId;
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
            const { fromDate, toDate, status, sortBy, amountFrom, amountTo, searchTerm, staffId, partnerId } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const promiseArray = [];
            let queryPipeline = [];
            // const matchObject: any = {};
            const matchObject: any = { $match: {} };
            const paginateOptions = {
                limit: limit || 10,
                page: page || 1,
            };
            // if (userData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE || userData.type === Constant.DATABASE.USER_TYPE.ADMIN.TYPE) {
            // matchObject['saveAsDraft'] = false;
            // }
            // if (status) {
            //     matchObject['status'] = status;
            // } else {
            matchObject.$match['status'] = Constant.DATABASE.STATUS.LOAN_STATUS.ACTIVE;
            // }
            if (sortBy) {
                sortingType = {
                    [sortBy]: sortType,
                };
            }
            if (status) {
                matchObject.$match['applicationStatus'] = status;
            }
            if (staffId) {
                matchObject.$match['assignedTo'] = Types.ObjectId(staffId);
            }
            // else {
            //     matchObject['applicationStatus'] =
            //         { $ne: Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value };
            // }

            if (amountFrom && amountTo) {
                matchObject.$match['loanDetails.loanAmount'] = {
                    $gt: amountFrom,
                    $lt: amountTo,
                };
            } else if (amountFrom && !amountTo) {
                matchObject.$match['loanDetails.loanAmount'] = {
                    $gt: amountFrom,
                };
            } else if (amountTo && !amountFrom) {
                matchObject.$match['loanDetails.loanAmount'] = {
                    $lt: amountTo,
                };
            }

            if (searchTerm) {
                matchObject.$match['$or'] = [
                    { 'personalInfo.firstName': { $regex: searchTerm, $options: 'i' } },
                    { 'personalInfo.middleName': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.phoneNumber': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.email': { $regex: searchTerm, $options: 'i' } },
                    { 'contactInfo.mobileNumber': { $regex: searchTerm, $options: 'i' } },
                    { referenceId: { $regex: searchTerm, $options: 'i' } },
                ];
            }

            if (fromDate && toDate) {
                matchObject.$match['createdAt'] = {
                    $gte: fromDate,
                    $lte: toDate,
                };
            }
            else if (toDate) {
                matchObject.$match['createdAt'] = {
                    $lte: toDate,
                };
            } else if (fromDate) {
                matchObject.$match['createdAt'] = {
                    $gte: fromDate,
                    $lte: new Date().getTime(),
                };
            }

            if (partnerId) {
                matchObject.$match['partnerId'] = partnerId;

            }
            const matchPipeline = [
                // {
                matchObject,
                { $sort: sortingType },
                {
                    $project: {
                        applicationStage: 0,
                    },
                },
                // },
            ];

            // if (payload.staffId) {
            queryPipeline = [{
                $lookup: {
                    from: 'admins',
                    let: { aid: '$assignedTo' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$aid'],
                                },
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                firstName: 1,
                                lastName: 1,
                                status: 1,
                            },
                        },
                    ],
                    as: 'assignedAdmin',
                },
            }, {
                $unwind: {
                    path: '$assignedAdmin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ];
            // } else {
            //     queryPipeline;
            // }
            // console.log('matchPipelinematchPipelinematchPipeline', matchPipeline);

            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, queryPipeline).aggregate(this.modelName);

            // promiseArray.push(this.DAOManager.findAll(this.modelName, matchObject, {}, { skip, limit, sort: sortingType }));
            // promiseArray.push(this.DAOManager.count(this.modelName, matchObject));
            // const [data, total] = await Promise.all(promiseArray);
            // return {
            //     data,
            //     total,
            // };
            return data;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @description A Function to map and send application data to sales-force
     * @param data Application Data
     */
    async sendApplication(data: any) {
        try {
            data = JSON.parse(JSON.stringify(data));
            async function GetFormattedDate(date) {
                const todayTime = new Date(date);
                const month = (todayTime.getMonth() + 1);
                const day = (todayTime.getDate());
                const year = (todayTime.getFullYear());
                console.log("day + ' - ' + month + ' - ' + year", day + '-' + month + '-' + year);
                return day + '-' + month + '-' + year;
            }

            if (data.personalInfo && data.personalInfo.creditCard && data.personalInfo.creditCard.status) {
                data.personalInfo.creditCard.status = Constant.CREDIT_CARD_STATUS[data.personalInfo.creditCard.status].label;
            }

            // gender = gender.charAt(0).toUpperCase() + gender.substr(1).toLowerCase();  //Constant.GENDER.FEMALE[gender].label;
            // nationality = nationality.charAt(0).toUpperCase() + gender.substr(1).toLowerCase();

            // Constant.GENDER.FEMALE[gender].label;

            if (data.personalInfo.gender) {
                data.personalInfo.gender = data.personalInfo.gender.charAt(0).toUpperCase() + data.personalInfo.gender.substr(1).toLowerCase();
            }
            if (data.personalInfo.nationality) {
                data.personalInfo.nationality = data.personalInfo.nationality.charAt(0).toUpperCase() + data.personalInfo.nationality.substr(1).toLowerCase();
            }
            if (data.contactInfo && data.contactInfo.currentAddress && data.contactInfo.currentAddress.homeOwnership) {
                data.contactInfo.currentAddress.homeOwnership = data.contactInfo.currentAddress.homeOwnership.charAt(0).toUpperCase() + data.contactInfo.currentAddress.homeOwnership.substr(1).toLowerCase();
            }
            if (data.personalInfo.civilStatus) {
                data.personalInfo.civilStatus = data.personalInfo.civilStatus.charAt(0).toUpperCase() + data.personalInfo.civilStatus.substr(1).toLowerCase();
            }

            // if (data['employmentInfo']['coBorrowerInfo']['employmentRank']) {
            if (data && data['employmentInfo'] && data['employmentInfo']['coBorrowerInfo'] && data['employmentInfo']['coBorrowerInfo']['employmentRank']) {

                data.employmentInfo.coBorrowerInfo.employmentRank = Constant.EMPLOYMENT_RANK[data.employmentInfo.coBorrowerInfo.employmentRank].label;
            }

            // if (data.employmentInfo.coBorrowerInfo.employmentType) {
            if (data && data['employmentInfo'] && data['employmentInfo']['coBorrowerInfo'] && data['employmentInfo']['coBorrowerInfo']['employmentType']) {
                data.employmentInfo.coBorrowerInfo.employmentType = Constant.EMPLOYMENT_TYPE[data.employmentInfo.coBorrowerInfo.employmentType].label;
            }

            if (data.employmentInfo.rank) {
                data.employmentInfo.rank = Constant.EMPLOYMENT_RANK[data.employmentInfo.rank].label;
            }

            if (data.employmentInfo.type) {
                data.employmentInfo.type = Constant.EMPLOYMENT_TYPE[data.employmentInfo.type].label;

            }

            // if (data.employmentInfo.coBorrowerInfo.companyIndustry) {
            if (data && data['employmentInfo'] && data['employmentInfo']['coBorrowerInfo'] && data['employmentInfo']['coBorrowerInfo']['companyIndustry']) {
                data.employmentInfo.coBorrowerInfo.companyIndustry = Constant.INDUSTRIES[data.employmentInfo.coBorrowerInfo.companyIndustry].label;
            }

            if (data.propertyInfo.type) {
                data.propertyInfo.type = Constant.LOAN_PROPERTY_TYPES[data.propertyInfo.type].label;
            }

            if (data.employmentInfo.companyIndustry) {
                data.employmentInfo.companyIndustry = Constant.INDUSTRIES[data.employmentInfo.companyIndustry].label;

            }

            if (data.propertyInfo.status) {
                data.propertyInfo.status = Constant.LOAN_PROPERTY_STATUS[data.propertyInfo.status].label;
            }

            if (data && data.loanDetails && data.loanDetails.loanType) {
                data.loanDetails.loanType = Constant.LOAN_TYPES[data.loanDetails.loanType].label;
            }

            if (data && data['personalInfo'] && data['personalInfo']['birthDate']) {
                data.personalInfo.birthDate = await GetFormattedDate(data['personalInfo']['birthDate'])
            }

            // 	birthDate: params['personalInfo']['birthDate'] ? GetFormattedDate(params['personalInfo']['birthDate']) : 'N/A',
            if (data && data['personalInfo'] && data['personalInfo']['spouseInfo'] && data['personalInfo']['spouseInfo']['birthDate']) {
                data['personalInfo']['spouseInfo']['birthDate'] = await GetFormattedDate(data['personalInfo']['spouseInfo']['birthDate']);
            }
            if (data && data['personalInfo'] && data['personalInfo']['coBorrowerInfo'] && data['personalInfo']['coBorrowerInfo']['birthDate']) {
                data['personalInfo']['coBorrowerInfo']['birthDate'] = await GetFormattedDate(data['personalInfo']['coBorrowerInfo']['birthDate']);
            }

            const salesforceData: { [key: string]: string | number } = flattenObject(data.toObject ? data.toObject() : data);
            console.log('zapier_loanUrlzapier_loanUrl', config.get('zapier_loanUrl'), config.get('environment'));
            if (config.get('environment') === 'production') {
                console.log('salesforceDatasalesforceDatasalesforceData', salesforceData);
                await fetch(config.get('zapier_loanUrl'), {
                    method: 'post',
                    body: JSON.stringify(salesforceData),
                });
            }
            return;

        } catch (error) {
            utils.errorReporter(error);
            return Promise.reject(error);
        }
    }


    // async updateLoanAMount(payload) {
    //     try {
    //         const findLoanData = await this.DAOManager.findOne(this.modelName, { _id: payload.loanId }, {});

    //         let totalMonthlyIncome = payload.employmentInfo.income;
    //         let preLoanMonthlyAmount = 0;
    //         if (payload.other.married.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.married.spouseMonthlyIncome; // If married need to add spouse income also to calculate debtToIncomeRatio
    //         if (payload.other.coBorrower.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.coBorrower.coBorrowerMonthlyIncome; // If coborrower need to add coborrower income
    //         if (payload.other.otherIncome.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.otherIncome.monthlyIncome; // If any investment exists than that is also added in the income part.
    //         // if other loans exits
    //         if (payload.other.prevLoans.status) preLoanMonthlyAmount = payload.other.prevLoans.monthlyTotal;
    //         // if (payload.other.creditCard.status === Constant.CREDIT_CARD_STATUS.YES.value && payload.other.creditCard.limit > 0) {
    //         //     preLoanMonthlyAmount = preLoanMonthlyAmount + payload.other.creditCard.limit;
    //         // }

    //         let localVisa = false;
    //         let ageAtlastLoanPayment = 0;

    //         // age filters
    //         if (payload.other.age) ageAtlastLoanPayment = payload.other.age + payload.loan.term;
    //         // if (ageAtlastLoanPayment >= 65) return []; // Max age is 65 till the final loan payment.
    //         if (ageAtlastLoanPayment >= 70) return []; // Max age is 65 till the final loan payment.

    //         const queryPipeline = [];


    //         queryPipeline[0].$match._id = Types.ObjectId(findLoanData.bankInfo.bankId);

    //         queryPipeline.push(
    //             {
    //                 $lookup: {
    //                     from: 'userloancriterias',
    //                     let: { bank_Id: '$_id' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$bankId', '$$bank_Id'],
    //                                 },
    //                             },
    //                         },
    //                         // {
    //                         //     $project: {
    //                         //         name: 1,
    //                         //         _id: 1,
    //                         //     },
    //                         // },
    //                     ],
    //                     as: 'userloan',
    //                 },
    //             },
    //             {
    //                 $unwind: {
    //                     path: '$userloan',
    //                     preserveNullAndEmptyArrays: true,
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     interestRate: `$interestRateDetails.${payload.loan.fixingPeriod}`,
    //                     loanableAmount: payload.loan.amount,
    //                     loanDurationYearly: payload.loan.term,
    //                     loanApplicationFeeAmount: 0,
    //                     fixingPeriod: payload.loan.fixingPeriod,
    //                     grossIncome: totalMonthlyIncome,
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     interestRateMonthly: { $divide: [{ $divide: ['$interestRate', 100] }, 12] },
    //                     loanDurationMonthly: { $multiply: [payload.loan.term, 12] },
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     numerator1: { $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] },
    //                     denominator: { $subtract: [{ $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] }, 1] },
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     numerator: { $multiply: ['$numerator1', '$interestRateMonthly', payload.loan.amount] },
    //                 },
    //             },
    //             // {
    //             //     $addFields: {
    //             //         totalLoanMonthlyAdd: {
    //             //             $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount],
    //             //         },
    //             //     },
    //             // },
    //             {
    //                 $project: {
    //                     abbrevation: 1,
    //                     totalPrice: 1,
    //                     bankName: 1,
    //                     headquarterLocation: 1,
    //                     bankFeePercent: 'up to 2%',
    //                     propertySpecification: 1,
    //                     bankFeeAmount: 1,
    //                     loanApplicationFeePercent: 1,
    //                     loanApplicationFeeAmount: 1,
    //                     // bankImageLogoUrl: 1,
    //                     logoUrl: 1,
    //                     iconUrl: 1,
    //                     bannerUrl: 1,
    //                     processingTime: 'As fast as 5 working days upon submission of complete documents',
    //                     interestRate: 1,
    //                     totalLoanMonthly: { $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount] },
    //                     monthlyPayment: { $divide: ['$numerator', '$denominator'] },

    //                     // totalLoanMonthly: { $round: [{ $add: [{ $divide: ['$numerator', '$denominator'] }, preLoanMonthlyAmount] }, 2] },
    //                     // monthlyPayment: {
    //                     //     $round: [{ $divide: ['$numerator', '$denominator'] }, 2],
    //                     // },
    //                     totalLoanPayment: 1,
    //                     bankId: '$_id',
    //                     _id: 0,
    //                     loanableAmount: 1,
    //                     loanDurationYearly: 1,
    //                     loanDurationMonthly: 1,
    //                     loanForCancelledCreditCard: 1,
    //                     fixingPeriod: 1,
    //                     grossIncome: 1,
    //                     // userId: {
    //                     //     $let: {
    //                     //         vars: {
    //                     //             userData,
    //                     //         },
    //                     //         in: userData._id,
    //                     //     },
    //                     // },
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     debtIncomePercentRatio: { $divide: [{ $multiply: ['$totalLoanMonthly', 100] }, totalMonthlyIncome] },
    //                 },
    //             },
    //             // {
    //             //     $addFields: {
    //             //         debtIncomePercentRatio: { $round: [{ $divide: [{ $multiply: ['$totalLoanMonthly', 100] }, totalMonthlyIncome] }, 2] },
    //             //     },
    //             // },
    //             {
    //                 $unwind: {
    //                     path: '$propertySpecification',
    //                     preserveNullAndEmptyArrays: true,
    //                 },
    //             },
    //             {
    //                 $match: {
    //                     'propertySpecification.allowedPropertyType': 'APARTMENT',
    //                     'propertySpecification.allowedPropertyStatus': 'FORECLOSED',
    //                 },
    //             },
    //             {
    //                 $addFields: {
    //                     debtIncomeRatio: '$propertySpecification.debtIncomeRatio',
    //                     maxLoanDurationAllowed: '$propertySpecification.maxLoanDurationAllowed',
    //                 },
    //             },
    //             {
    //                 $project: {
    //                     propertySpecification: 0,
    //                 },
    //             },
    //             {
    //                 $match: {
    //                     $expr: {
    //                         $gte: ['$debtIncomeRatio', '$debtIncomePercentRatio'],
    //                     },
    //                 },
    //             },
    //             {
    //                 $sort: {
    //                     monthlyPayment: 1,
    //                 },
    //             },
    //         );

    //         const data = await this.DAOManager.aggregateData(this.modelName, queryPipeline);
    //         return data;
    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }
}
export const LoanApplicationEntity = new LoanApplicationE();

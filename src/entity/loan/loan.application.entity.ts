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
            // if (config.get['environment'] === 'production') {
            //     console.log('productionproductionproduction>>>>>>>>>>>>>>>>.');

            await this.sendApplication(data);
            // }
            return data;
        } catch (error) {
            console.log('saveLoanApplicationsaveLoanApplicationsaveLoanApplication', error);

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
            // if (config.get['environment'] === 'production') {
            //     console.log('productionproductionproduction>>>>>>>>>>>>>>>>.');
            await this.sendApplication(data);
            // }
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
            if (userData._id) {
                matchObject = {
                    userId: userData._id,
                };
            }

            sortingType = {
                createdAt: sortType,
            };

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
            const { fromDate, toDate, status, sortBy, amountFrom, amountTo, searchTerm, staffId } = payload;
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
            console.log('matchObjectmatchObjectmatchObject', matchObject);

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
            // console.log('matchPipelinematchPipelinematchPipeline', matchPipeline);

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
                                }
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                firstName: 1,
                                lastName: 1,
                                status: 1,
                            },
                        }
                    ],
                    as: 'assignedAdmin',
                },
            }, {
                $unwind: {
                    path: '$assignedAdmin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ]
            // } else {
            //     queryPipeline;
            // }
            // console.log('matchPipelinematchPipelinematchPipeline', matchPipeline);

            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, queryPipeline).aggregate(this.modelName);
            console.log('datadatadatadatadata', data);

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
            console.log('dataAAAAAAAAAAAAAAA>>>>>>>>>>>>>>>>>>>>>>>>>>', data);

            // console.log('inside Loan');
            // const { creditCard, nationality, gender, coBorrowerInfo } = data.personalInfo;
            // const { loanDetails } = data.loanDetails;
            // const { contactInfo } = data.contactInfo;
            // const { employmentInfo } = data;

            console.log('ewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

            data.personalInfo.creditCard.status = Constant.CREDIT_CARD_STATUS[data.personalInfo.creditCard.status].label;

            // gender = gender.charAt(0).toUpperCase() + gender.substr(1).toLowerCase();  //Constant.GENDER.FEMALE[gender].label;
            // nationality = nationality.charAt(0).toUpperCase() + gender.substr(1).toLowerCase();

            // Constant.GENDER.FEMALE[gender].label;

            if (data.personalInfo.gender) {
                data.personalInfo.gender = data.personalInfo.gender.charAt(0).toUpperCase() + data.personalInfo.gender.substr(1).toLowerCase();
            }
            if (data.personalInfo.nationality) {
                data.personalInfo.nationality = data.personalInfo.nationality.charAt(0).toUpperCase() + data.personalInfo.nationality.substr(1).toLowerCase();
            }
            if (data.contactInfo.currentAddress.homeOwnership) {
                data.contactInfo.currentAddress.homeOwnership = data.contactInfo.currentAddress.homeOwnership.charAt(0).toUpperCase() + data.contactInfo.currentAddress.homeOwnership.substr(1).toLowerCase();
            }
            if (data.personalInfo.civilStatus) {
                console.log('civilStatuscivilStatuscivilStatuscivilStatuscivilStatus');
                data.personalInfo.civilStatus = data.personalInfo.civilStatus.charAt(0).toUpperCase() + data.personalInfo.civilStatus.substr(1).toLowerCase();
            }
            // console.log("data['employmentInfo']", data['employmentInfo']['coBorrowerInfo']);



            // if (data['employmentInfo']['coBorrowerInfo']['employmentRank']) {
            if (data && data['employmentInfo'] && data['employmentInfo']['coBorrowerInfo'] && data['employmentInfo']['coBorrowerInfo']['employmentRank']) {

                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>22222222222222', data.employmentInfo.coBorrowerInfo.employmentRank);
                // console.log(' Constant.EMPLOYMENT_RANK[data.employmentInfo.coBorrowerInfo.employmentRank].label;', Constant.EMPLOYMENT_RANK[data.employmentInfo.coBorrowerInfo.employmentRank].label);

                data.employmentInfo.coBorrowerInfo.employmentRank = Constant.EMPLOYMENT_RANK[data.employmentInfo.coBorrowerInfo.employmentRank].label;
            }

            // if (data.employmentInfo.coBorrowerInfo.employmentType) {
            if (data && data['employmentInfo'] && data['employmentInfo']['coBorrowerInfo'] && data['employmentInfo']['coBorrowerInfo']['employmentType']) {
                console.log('1>>>>>>>>>>>>>>>>');
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
                console.log('33333333333333333333333333333333333333333333');
                data.employmentInfo.coBorrowerInfo.companyIndustry = Constant.INDUSTRIES[data.employmentInfo.coBorrowerInfo.companyIndustry].label;
            }

            if (data.propertyInfo.type) {
                data.propertyInfo.type = Constant.LOAN_PROPERTY_TYPES[data.propertyInfo.type].label;
                console.log('>44444444444444444444444444444444444444444');
            }

            if (data.employmentInfo.companyIndustry) {
                data.employmentInfo.companyIndustry = Constant.INDUSTRIES[data.employmentInfo.companyIndustry].label;
                console.log('5555555555555555555666666666666666666666666666666666666666666666666666666666666');

            }
            // coBorrowerInfo.employmentType = Constant.EMPLOYMENT_TYPE[coBorrowerInfo.employmentType].label;

            // if (data.propertyInfo.type) {
            //     console.log('>>>>>>>>>>>>>>>>>>>LLLLLLLLLLLLLLL777777777777777777777');
            //     data.propertyInfo.type = Constant.LOAN_PROPERTY_TYPES[data.propertyInfo.type].label;
            //     console.log('>>>>>>>>>>>>>>>>>>>LLLLLLLLLLLLLLL777777777777777777777>>>>>>>>>>>>');

            // }
            if (data.propertyInfo.status) {
                console.log('>>>>>>>>>>*888888888888888888888888888888888888888888888888888888888888888');
                data.propertyInfo.status = Constant.LOAN_PROPERTY_STATUS[data.propertyInfo.status].label;
                console.log('>>>>>>>>>>*888888888888888888888888888888888888888888888888888888888888888>>>>>>>');
            }

            if (data && data.loanDetails && data.loanDetails.loanType) {
                console.log('>>>>>>>>>>*9999999999999999999999999999999999999999999999');
                data.loanDetails.loanType = Constant.LOAN_TYPES[data.loanDetails.loanType].label;
                console.log('>>>>>>>>>>*9999999999999999999999999999999999999999999999>>>>>>>>>>>>>>>');
            }

            console.log('loanDetailsloanDetails>>>>>>>>>>', data);
            // if (data.applicationStatus === Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value ) {


            const salesforceData: { [key: string]: string | number } = flattenObject(data.toObject ? data.toObject() : data);
            console.log('zapier_loanUrlzapier_loanUrl', config.get('zapier_loanUrl'), config.get('environment'));
            console.log('salesforceDatasalesforceDatasalesforceData', salesforceData);
            if (config.get('environment') === 'production') {
                console.log('333333333333333333333333333333333333344444444444kkkkkkkkk');

                await fetch(config.get('zapier_loanUrl'), {
                    method: 'post',
                    body: JSON.stringify(salesforceData),
                });
            }
            // }
            return;

        } catch (error) {
            console.log('eorrrrrrrrrrrrrrrrrrrrrrrrr', error);
            return Promise.reject(error);
            // return (UniversalFunctions.sendError(error));
            // console.log('errorerrorerrorerrorerror', error);
            // return Promise.reject(error);
        }
    }
}
export const LoanApplicationEntity = new LoanApplicationE();

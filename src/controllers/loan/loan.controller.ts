import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as Constant from '../../constants/app.constant';
import * as utils from 'src/utils';
import { PreQualificationBankE } from '@src/entity/loan/prequalification.entity';
import { MailManager } from '../../lib/mail.manager';
import fetch from 'node-fetch';
import * as config from 'config';
class LoanControllers extends BaseEntity {

    /**
     * @function addLoanRequirements
     * @description
     * @payload :IAddLoanRequirement
     * return
     */

    async addLoanRequirements(payload: LoanRequest.IAddLoanRequirement) {
        try {
            const bankData = await ENTITY.LoanEntity.createOneEntity(payload);
            if (bankData) {
                payload['bankId'] = Types.ObjectId(bankData._id);
                await ENTITY.EligibilityEntity.createOneEntity(payload);
            }
            return;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function addLoanApplication
     * @description
     * @payload :AddLoan
     * return loanID
     */
    async addLoanApplication(payload: LoanRequest.AddLoan, userData) {
        try {
            const criteria = {
                saveAsDraft: { $ne: true },
            };
            payload['userId'] = payload.userId ? payload.userId : userData._id;
            const criteria1 = ({
                createdAt: {
                    $gte: new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
                },
            });

            const referenceNumber = await ENTITY.LoanApplicationEntity.getReferenceId(criteria1);
            if (!referenceNumber) {
                const year = new Date(new Date().getTime()).getFullYear().toString().substr(-2);
                const month = ('0' + (new Date(new Date().getTime()).getMonth() + 1)).slice(-2);
                const date = ('0' + (new Date(new Date().getTime()).getDate())).slice(-2);
                const referenceId = 1;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + Contsant.SERVER.LOAN_PRE__ZEOS + referenceId;
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
            payload['applicationStage'] = {
                userType: userData.type,
                status: payload.applicationStatus,
                adminId: userData._id,
                adminName: userData.firstName + ' ' + userData.lastName,
            };
            const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            const dataToSave = {
                userId: payload.userId ? payload.userId : userData._id,
                data: payload,
                referenceId: payload['referenceId'],
            };
            const saveAllData = await ENTITY.LoanErrorE.createOneEntity(dataToSave);
            return data['referenceId'];

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function updateLoanApplication
     * @description updateLoanApplication before submitted
     * @payload :AddLoan
     * return {data}
     */

    async updateLoanApplication(payload: LoanRequest.AddLoan, userData) {
        try {
            const dataToUpdate: any = {};
            // dataToUpdate.$set = { applicationStatus: payload.status };
            dataToUpdate.$push = {
                applicationStage: {
                    userType: userData.type,
                    status: payload.applicationStatus,
                    adminId: userData._id,
                    adminName: userData ? userData.firstName + ' ' + userData.lastName : userData.userName,
                    approvedAt: new Date().getTime(),
                },
            };

            // payload['applicationStage'] = {
            //     userType: userData.type,
            //     status: payload.applicationStatus,
            //     adminId: userData._id,
            //     adminName: userData.firstName + '' + userData.lastName,
            // };
            const data = await ENTITY.LoanApplicationEntity.updateLoanApplication(payload);
            return data['referenceId'];
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function checkPreloanApplication
     * @description pre loan conditions
     * @payload :
     * return []
     */

    async checkPreloanApplication(payload: LoanRequest.PreLoan, userData) {
        try {
            return await LoanEntity.preloan(payload, userData);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function userLoansList
     * @description user loan list
     * @payload : IGetUserLoanList
     * return []
     */

    async userLoansList(payload: LoanRequest.IGetUserLoanList, userData) {
        try {
            return await ENTITY.LoanApplicationEntity.getUserLoanList(payload, userData);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function adminLoansList
     * @description admin loan list
     * @payload : IGetUserLoanList
     * return []
     */

    async adminLoansList(payload: LoanRequest.IGetAdminLoanList, adminData) {
        try {
            return await ENTITY.LoanApplicationEntity.getAdminLoanList(payload, adminData);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function loanById
     * @description user loan by id
     * @payload : LoanById
     * return {}
     */

    async loanById(payload: LoanRequest.LoanById, userData) {
        try {
            const criteria = { _id: Types.ObjectId(payload.loanId) };

            const aggregate = [{
                $match: criteria,
            }, {
                $project: {
                    applicationStage: 0,
                },
            }, {
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
            },
            {
                $unwind: {
                    path: '$assignedAdmin',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ];
            console.log('aggregateaggregateaggregate', aggregate);

            const data = await ENTITY.LoanApplicationEntity.aggregate(aggregate);
            console.log('datadatadata', data);

            // const data = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, {});
            if (!data) return Promise.reject(Contsant.STATUS_MSG.SUCCESS.S204.NO_CONTENT_AVAILABLE);
            else return data[0] ? data[0] : {};
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function adminUpdateLoanStatus
     * @description admin update status of the loan
     * @payload :IUpdateLoanRequest
     * return {}
     */

    async adminUpdateLoanStatus(payload: AdminRequest.IUpdateLoanRequest, adminData) {
        try {
            const criteria = { _id: payload.loanId };
            const dataToUpdate: any = {};
            if (payload.status) {
                dataToUpdate.$set = { applicationStatus: payload.status };
            }
            if (payload.staffId) {
                dataToUpdate.$set = { assignedTo: payload.staffId };
            }
            dataToUpdate.$push = {
                applicationStage: {
                    userType: adminData.type,
                    status: payload.status,
                    adminId: adminData._id,
                    adminName: adminData ? adminData.firstName + ' ' + adminData.lastName : adminData.email,
                    approvedAt: new Date().getTime(),
                    assignedTo: payload.staffId ? payload.staffId : '',
                },
            };

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND);
            else {
                if (payload.staffId) {
                    const getStaffData = await ENTITY.AdminE.getOneEntity({ _id: payload.staffId }, {});
                    console.log('getStaffName>>>>>>>>>>>>', getStaffData);
                    const salesforceData = {
                        _id: payload.loanId,
                        staffAssignedEmail: getStaffData.email,
                        staffAssignedfirstName: getStaffData.firstName,
                        staffAssignedlastName: getStaffData.lastName,
                    };
                    if (config.get('environment') === 'production') {
                        await fetch(config.get('zapier_loanUrl'), {
                            method: 'post',
                            body: JSON.stringify(salesforceData),
                        });
                    }
                    return data;
                }
                return data;
            }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function loanShuffle
     * @description bankshuffledList name and images
     * @payload :
     * return [{}]
     */

    async loanShuffle() {
        try {
            const bankList = await this.DAOManager.findAll('Bank', {}, { bankName: 1, iconUrl: 1, bannerUrl: 1, logoUrl: 1 });
            return bankList.sort(() => 0.5 - Math.random());
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     *
     */
    async preQualificationList(payload, adminData) {
        try {
            const data = await PreQualificationBankE.preloanList(payload, adminData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async preQualificationDetail(payload) {
        try {
            const data = await PreQualificationBankE.preLoanDetail(payload);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminUpdateLoanApplication(payload, adminData) {
        try {
            console.log('adminDataadminDataadminDataadminData', adminData);

            const query = {
                _id: payload.loanId,
            };

            const oldData = await ENTITY.LoanApplicationEntity.updateOneEntity(query, payload, false);
            console.log('oldDataoldDataoldDataoldDataoldData', oldData);

            payload['changesMadeBy'] = {
                adminId: adminData['_id'],
                adminName: adminData['name'],
            };

            const createHistory = await this.DAOManager.insert('LoanApplicationHistory', payload);
            if (oldData) {
                return oldData['referenceId'];
            }
            return Promise.reject(Constant.STATUS_MSG.SUCCESS.S204.NO_CONTENT_AVAILABLE);
            // return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminAddPrequalification(payload, adminData) {
        try {
            return await ENTITY.PreQualificationBankE.addBanks(payload, adminData);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async downloadPdf(payload, userData) {
        try {
            const criteria = {
                referenceId: payload.loanId,
            };
            const getLoanData = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, {});
            // console.log('getLoanData>>>>>>>>>>>>>>', getLoanData);
            // return getLoanData;
            if (!getLoanData) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            }

            const mail = new MailManager();
            const data = await mail.generateLoanApplicationform(getLoanData);

            console.log('datadatadatadatadatadatadata', data);
            console.log('loanId: getLoanData[\'refrenceId\'],', getLoanData['referenceId']);

            return {
                data,
                loanId: getLoanData['referenceId'],
            };

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getDocuments(payload) {
        try {
            const criteria = {
                _id: payload.bankId,
            };
            const promise = [];

            let aggregateLegal;
            if (payload.employmentType) {
                console.log(1111111111111111111111111111111111111111);

                aggregateLegal = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        propertySpecification: 0,
                        interestRateDetails: 0,
                        loanForForeigner: 0,
                        loanForForeignerMarriedLocal: 0,
                        loanForNonCreditCardHolder: 0,
                        loanForCreditCardHolder: 0,
                        loanForNotNowCreditCardHolder: 0,
                        loanAlreadyExistDiffBank: 0,
                        loanAlreadyExistSameBank: 0,
                        missedLoanPaymentAllowance: 0,
                        abbrevation: 0,
                        bankName: 0,
                        headquarterLocation: 0,
                        loanForCancelledCreditCard: 0,
                        bankFeePercent: 0,
                        bankFeeAmount: 0,
                        loanApplicationFeePercent: 0,
                        loanApplicationFeeAmount: 0,
                        loanMinAmount: 0,
                        loanMaxAmount: 0,
                        minLoanDuration: 0,
                        maxLoanDuration: 0,
                        minAgeRequiredForLoan: 0,
                        minMonthlyIncomeRequired: 0,
                        logoUrl: 0,
                        iconUrl: 0,
                        bannerUrl: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        incomeDocument: 0,
                        collateralDocument: 0,
                        __v: 0,
                    },
                },
                {
                    $unwind: {
                        path: '$legalDocument',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        //              "legalDocument.coborrower" : false,
                        'legalDocument.allowedFor': payload.employmentType,

                    },
                },
                ];
            }
            let aggregateIncome;
            if (payload.employmentType) {
                console.log(22222222222222222222222222222222222222);

                aggregateIncome = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        propertySpecification: 0,
                        interestRateDetails: 0,
                        loanForForeigner: 0,
                        loanForForeignerMarriedLocal: 0,
                        loanForNonCreditCardHolder: 0,
                        loanForCreditCardHolder: 0,
                        loanForNotNowCreditCardHolder: 0,
                        loanAlreadyExistDiffBank: 0,
                        loanAlreadyExistSameBank: 0,
                        missedLoanPaymentAllowance: 0,
                        abbrevation: 0,
                        bankName: 0,
                        headquarterLocation: 0,
                        loanForCancelledCreditCard: 0,
                        bankFeePercent: 0,
                        bankFeeAmount: 0,
                        loanApplicationFeePercent: 0,
                        loanApplicationFeeAmount: 0,
                        loanMinAmount: 0,
                        loanMaxAmount: 0,
                        minLoanDuration: 0,
                        maxLoanDuration: 0,
                        minAgeRequiredForLoan: 0,
                        minMonthlyIncomeRequired: 0,
                        logoUrl: 0,
                        iconUrl: 0,
                        bannerUrl: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        legalDocument: 0,
                        collateralDocument: 0,
                        __v: 0,
                    },
                },
                {
                    $unwind: {
                        path: '$incomeDocument',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        // "legalDocument.coborrower" : false,
                        'incomeDocument.allowedFor': payload.employmentType,

                    },
                },
                ];
                // promise.push(ENTITY.BankE.aggregate(aggregateIncome));
            }
            let aggregateColleteralDocument;
            if (payload.propertyStatus) {
                console.log('33333333333333333333333333333333333333');

                aggregateColleteralDocument = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        propertySpecification: 0,
                        interestRateDetails: 0,
                        loanForForeigner: 0,
                        loanForForeignerMarriedLocal: 0,
                        loanForNonCreditCardHolder: 0,
                        loanForCreditCardHolder: 0,
                        loanForNotNowCreditCardHolder: 0,
                        loanAlreadyExistDiffBank: 0,
                        loanAlreadyExistSameBank: 0,
                        missedLoanPaymentAllowance: 0,
                        abbrevation: 0,
                        bankName: 0,
                        headquarterLocation: 0,
                        loanForCancelledCreditCard: 0,
                        bankFeePercent: 0,
                        bankFeeAmount: 0,
                        loanApplicationFeePercent: 0,
                        loanApplicationFeeAmount: 0,
                        loanMinAmount: 0,
                        loanMaxAmount: 0,
                        minLoanDuration: 0,
                        maxLoanDuration: 0,
                        minAgeRequiredForLoan: 0,
                        minMonthlyIncomeRequired: 0,
                        logoUrl: 0,
                        iconUrl: 0,
                        bannerUrl: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        legalDocument: 0,
                        incomeDocument: 0,
                        __v: 0,

                    },
                },
                {
                    $unwind: {
                        path: '$collateralDocument',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        //              "legalDocument.coborrower" : false,
                        'collateralDocument.allowedFor': payload.propertyStatus,

                    },
                },

                ];
                // promise.push(ENTITY.BankE.aggregate(aggregateColleteralDocument));

            }

            // const data = await ENTITY.BankE.aggregate(aggregateIncome);

            if (payload.employmentType) {
                promise.push(ENTITY.BankE.aggregate(aggregateLegal));
            } else {
                promise.push([]);
            }

            if (payload.employmentType) {
                promise.push(ENTITY.BankE.aggregate(aggregateIncome));
            } else {
                promise.push([]);
            }
            // promise.push(ENTITY.BankE.aggregate(aggregateIncome));
            if (payload.propertyStatus) {
                promise.push(ENTITY.BankE.aggregate(aggregateColleteralDocument));
            } else {
                promise.push([]);
            }
            // promise.push(ENTITY.BankE.aggregate(aggregateColleteralDocument));

            const [legalDoc, incomeDoc, colleteralDoc] = await Promise.all(promise);
            return {
                legalDoc: legalDoc ? legalDoc : [],
                incomeDoc: incomeDoc ? incomeDoc : [],
                colleteralDoc: colleteralDoc ? colleteralDoc : [],
            };
            // console.log('datadata', data);
            // return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminUpdateDocumentStatus(payload) {
        try {
            const criteria = {
                '_id': payload.loanId,
                'documents.legalDocument._id': payload.documentId,
            };

            const dataToUpdate = {
                'documents.legalDocument.$.status': payload.status,
            };

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            return data['documents'];
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const LoanController = new LoanControllers();

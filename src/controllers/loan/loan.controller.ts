import { LOAN_TYPES } from './../../constants/loan.constant';
import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as Constant from '../../constants/app.constant';
import * as utils from 'src/utils';
import { PreQualificationBankE } from '@src/entity/loan/prequalification.entity';
import { MailManager } from '../../lib/mail.manager';
import fetch from 'node-fetch';
import * as config from 'config';
import { flattenObject } from '@src/utils/flatten.util';
import { LoanApplicationEntity } from '@src/entity/loan/loan.application.entity';
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
                    $gte: new Date().setHours(0, 0, 0, 0) // new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
                },
            });
            //new Date().setHours(0, 0, 0, 0)  
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
            if(payload['loanDetails']['loanType']==='PURCHASE_OF_PROPERTY' && payload['loanDetails']['propertyClassification']==null || payload['loanDetails']['propertyClassification']==='DOU'){
                payload['loanDetails']['propertyClassification']="DOU"
            
            }
            else if( payload['loanDetails']['propertyClassification']==null || payload['loanDetails']['propertyClassification']==='REM'){
                payload['loanDetails']['propertyClassification']="REM"
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
            if (userData.type === Constant.DATABASE.USER_TYPE.ADMIN.TYPE || userData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                return {
                    referenceId: data['referenceId'],
                    applicationStatus: data['applicationStatus'],
                    _id: data['_id'],
                    classification:data["loanDetails"]["propertyClassification"]
                }
            }
            return {referenceId:data['referenceId'],
                    _id:data['_id'],  
                    classification:data["loanDetails"]["propertyClassification"]
        
        };


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
            const data = await ENTITY.LoanApplicationEntity.updateLoanApplication(payload,userData);
            // console.log("data before update",data)
            payload['referenceId']=data['referenceId'];
            payload['userId']=userData._id;
            const updatedBy= userData.firstName;
            if(payload.notificationType){
            await ENTITY.NotificationE.saveNotification(payload,updatedBy);
            }
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
     * @function AdminUserLoansList
     * @description user loan list
     * @payload : IGetUserLoanList
     * return []
     */

     async adminUserLoansList(payload: LoanRequest.IGetUserLoanList) {
        try {
            return await ENTITY.LoanApplicationEntity.getAdminUserLoanList(payload);
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

            const data = await ENTITY.LoanApplicationEntity.aggregate(aggregate);

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
                const getStaffData = await ENTITY.AdminE.getOneEntity({ _id: payload.staffId }, {});
                if (payload.staffId) {
                    dataToUpdate.$set = {
                        assignedTo: payload.staffId,
                        staffAssignedEmail: getStaffData && getStaffData.email || '',
                        staffAssignedfirstName: getStaffData && getStaffData.firstName || '',
                        staffAssignedlastName: getStaffData && getStaffData.lastName || '',
                    };
                }

                dataToUpdate.$push = {
                    applicationStage: {
                        userType: adminData.type,
                        status: payload.status,
                        adminId: adminData._id,
                        adminName: (adminData && adminData.firstName) ? adminData.firstName + ' ' + adminData.lastName : adminData.email,
                        approvedAt: new Date().getTime(),
                        assignedTo: (payload && payload.staffId) ? payload.staffId : '',
                    },
                };
            }
            const oldData=await ENTITY.LoanApplicationEntity.DAOManager.findOne('LoanApplication',{_id: Types.ObjectId(payload.loanId)},{"applicationStatus":1});

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate, { new: true, lean: true });

            const recentData=await ENTITY.LoanApplicationEntity.DAOManager.findOne('LoanApplication',{_id: Types.ObjectId(payload.loanId)},{"applicationStatus":1});
            const updateBy= adminData['name'];
            console.log("prevData====>>>",oldData);
            console.log("newData====>>>",recentData);
            console.log("updated by===>>>", updateBy)
        
            await ENTITY.HistoryE.saveHistory(oldData,recentData,updateBy);


            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND);
            // else {
            // JSON.parse(JSON.stringify(data));
            async function GetFormattedDate(date) {
                const todayTime = new Date(date);
                const month = (todayTime.getMonth() + 1);
                const day = (todayTime.getDate());
                const year = (todayTime.getFullYear());
                console.log("day + ' - ' + month + ' - ' + year", day + '-' + month + '-' + year);
                return day + '-' + month + '-' + year;
            }
            if (data && data['personalInfo'] && data['personalInfo']['birthDate']) {
                data.personalInfo.birthDate = GetFormattedDate(data['personalInfo']['birthDate'])
            }
            // 	birthDate: params['personalInfo']['birthDate'] ? GetFormattedDate(params['personalInfo']['birthDate']) : 'N/A',
            if (data && data['personalInfo'] && data['personalInfo']['spouseInfo'] && data['personalInfo']['spouseInfo']['birthDate']) {
                data['personalInfo']['spouseInfo']['birthDate'] =GetFormattedDate(data['personalInfo']['spouseInfo']['birthDate']);
            }
            if (data && data['personalInfo'] && data['personalInfo']['coBorrowerInfo'] && data['personalInfo']['coBorrowerInfo']['birthDate']) {
                data['personalInfo']['coBorrowerInfo']['birthDate'] = GetFormattedDate(data['personalInfo']['coBorrowerInfo']['birthDate']);
            }
            let salesforceData = flattenObject(data.toObject ? data.toObject() : data);
            console.log('salesforceDatasalesforceData', salesforceData);
            if (payload.staffId) {
                // const getStaffData = await ENTITY.AdminE.getOneEntity({ _id: payload.staffId }, {});
                salesforceData = {
                    ...salesforceData,
                    // _id: payload.loanId,
                    // staffAssignedEmail: getStaffData && getStaffData.email || '',
                    // staffAssignedfirstName: getStaffData && getStaffData.firstName || '',
                    // staffAssignedlastName: getStaffData && getStaffData.lastName || '',
                };
            }
            if (payload.status) {
                salesforceData = {
                    ...salesforceData,
                    // _id: payload.loanId,
                    // applicationStatus: payload.status,
                };
            }

            if (config.get('environment') === 'production') {

                await fetch(config.get('zapier_loanUrl'), {
                    method: 'post',
                    body: JSON.stringify(salesforceData),
                });
            }
            return data;
        } catch (error) {
            utils.errorReporter(error);
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
     * @description admin prequalificatio  list
     */
    async preQualificationList(payload: PreQualificationRequest.IAdminPrequalificationList, adminData) {
        try {
            const data = await PreQualificationBankE.preloanList(payload, adminData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async preQualificationDetail(payload: PreQualificationRequest.IprequalificationDetail) {
        try {
            const data = await PreQualificationBankE.preLoanDetail(payload);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminUpdateLoanApplication(payload, adminData) {
        try {
            const query = {
                _id: payload.loanId,
            };
            const prevData=await this.DAOManager.findOne('LoanApplication',{_id: Types.ObjectId(payload.loanId)},{});
            const oldData = await ENTITY.LoanApplicationEntity.updateOneEntity(query, payload);
            const newData=await this.DAOManager.findOne('LoanApplication',{_id: Types.ObjectId(payload.loanId)},{});
             const updateBy= adminData['name'];
            // console.log("prevData======>",JSON.stringify(prevData))
            // console.log("oldData======>",JSON.stringify(oldData))
            // console.log("newData======>",JSON.stringify(newData))
            
             console.log("updateBy======>",updateBy);


            await ENTITY.HistoryE.saveHistory(prevData,newData,updateBy);
            await LoanApplicationEntity.sendApplication(oldData)

            payload['changesMadeBy'] = {
                adminId: adminData['_id'],
                adminName: adminData['name'],
            };

            const createHistory = await this.DAOManager.insert('LoanApplicationHistory', payload);
            if (oldData) {
                return {
                    referenceId: oldData['referenceId'],
                    applicationStatus: oldData['applicationStatus'],
                    _id: oldData['_id']
                }
            }
            return Promise.reject(Constant.STATUS_MSG.SUCCESS.S204.NO_CONTENT_AVAILABLE);
            // return data;
        } catch (error) {
            utils.errorReporter(error);
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
            if (!getLoanData) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            }

            const mail = new MailManager();
            const data = await mail.generateLoanApplicationform(getLoanData);

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
            if (payload.employmentType === 'GOVT' || payload.employmentType === 'BPO') {
                payload['employmentType'] = 'PRIVATE';
            }
            // LOAN_PROPERTY_STATUS.NEW_CONSTRUCTION.value,

            if (payload.propertyStatus === 'FORECLOSED' || payload.propertyStatus === 'RESELLING' || payload.propertyStatus === 'PRE_SELLING') {
                payload['propertyStatus'] = 'READY_FOR_OCCUPANCY';
            }

            const criteria = {
                _id: payload.bankId,
            };
            const promise = [];

            let aggregateLegal;
            if (payload.employmentType) {

                aggregateLegal = [
                    {
                        $match: {
                            _id: Types.ObjectId(payload.bankId),
                        },
                    },
                    {
                        $project: {
                            legalDocument: 1,
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
                            'legalDocument.allowedFor': payload.employmentType,
                        },
                    },
                ];
            }
            if (payload.civilStatus === Constant.DATABASE.CIVIL_STATUS.MARRIED && payload.coBorrowerInfo) {
                const pushedItem = {
                    $match: {
                        $and: [{
                            $or: [{
                                'legalDocument.isSpouse': true,
                            },
                            {
                                'legalDocument.coborrower': true,
                            },
                            {
                                'legalDocument.isSingle': { $exists: false },
                            },
                            ],
                        },
                        ],
                    },
                };
                aggregateLegal.splice(5, 5, pushedItem);
            }

            else if (payload.coBorrowerInfo && payload.civilStatus !== Constant.DATABASE.CIVIL_STATUS.MARRIED) {
                const pushedItem = {
                    $match: {
                        $and: [{
                            $or: [
                                {
                                    'legalDocument.coborrower': { $exists: true },
                                },
                                {
                                    'legalDocument.isSpouse': { $exists: false },
                                },
                            ],
                        },
                        {
                            'legalDocument.isSingle': { $exists: false },
                        },
                            // {
                            //     'legalDocument.isSingle': { $exists: true },
                            // },
                        ],
                    },
                };
                aggregateLegal.push(pushedItem);
            }

            else if (payload.civilStatus !== Constant.DATABASE.CIVIL_STATUS.MARRIED && !payload.coBorrowerInfo) {
                const pushedItem = {
                    $match: {
                        $and: [{
                            'legalDocument.coborrower': { $exists: false },
                        },
                        {
                            'legalDocument.isSpouse': { $exists: false },
                        },
                        ],
                    },
                };
                aggregateLegal.push(pushedItem);
            }
            else if (payload.civilStatus === Constant.DATABASE.CIVIL_STATUS.MARRIED && !payload.coBorrowerInfo) {
                const pushedItem = {
                    $match: {
                        $and: [{
                            $or: [
                                {
                                    'legalDocument.isSpouse': { $exists: true },
                                },
                                {
                                    'legalDocument.isSingle': { $exists: false },
                                },
                            ],
                        },
                        {
                            'legalDocument.coborrower': { $exists: false },
                        },
                            // {
                            //     'legalDocument.isSingle': { $exists: true },
                            // },
                        ],
                        // $or: [
                        //     { doSomething: { $exists: false } },
                        //     { doSomething: false }
                        // ]
                    },
                };
                aggregateLegal.push(pushedItem);
            }

            let aggregateIncome;
            if (payload.employmentType) {
                aggregateIncome = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        incomeDocument: 1
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
            if (payload.loanType==='PURCHASE_OF_PROPERTY' && payload.classification==null || payload.classification==='DOU') {
                aggregateColleteralDocument = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        collateralDocument: 1,
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
                        'collateralDocument.classification':{$in:["DOU"]},
                        'collateralDocument.allowedFor': payload.loanType,

                    },
                },

                ];
                // promise.push(ENTITY.BankE.aggregate(aggregateColleteralDocument));

            } else{
                aggregateColleteralDocument = [{
                    $match: {
                        _id: Types.ObjectId(payload.bankId),
                    },
                },
                {
                    $project: {
                        collateralDocument: 1,
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
                        'collateralDocument.classification':{$in:["REM"]},
                        'collateralDocument.allowedFor': payload.loanType,

                    },
                },

                ];

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
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminUpdateDocumentStatus(payload) {
        try {
            let criteria;
            if (payload.documentType === 'Legal') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.legalDocument._id': payload.documentId,
                };
            }
            else if (payload.documentType === 'Income') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.incomeDocument._id': payload.documentId,
                };
            }
            else if (payload.documentType === 'Colleteral') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.colleteralDoc._id': payload.documentId,
                };
            }

            let dataToUpdate;
            if (payload.documentType === 'Legal') {
                dataToUpdate = {
                    'documents.legalDocument.$.status': payload.status,
                    'documents.legalDocument.$.updatedAt': new Date().getTime(),
                };
            }
            else if (payload.documentType === 'Income') {
                dataToUpdate = {
                    'documents.incomeDocument.$.status': payload.status,
                    'documents.incomeDocument.$.updatedAt': new Date().getTime(),
                };
            }
            else if (payload.documentType === 'Colleteral') {
                dataToUpdate = {
                    'documents.colleteralDoc.$.status': payload.status,
                    'documents.colleteralDoc.$.updatedAt': new Date().getTime(),
                };
            }

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async updateDocument(payload) {
        try {
            let criteria;
            if (payload.documentType === 'Legal') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.legalDocument._id': payload.documentId,
                };
            }
            else if (payload.documentType === 'Income') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.incomeDocument._id': payload.documentId,
                };
            }
            else if (payload.documentType === 'Colleteral') {
                criteria = {
                    '_id': payload.loanId,
                    'documents.colleteralDoc._id': payload.documentId,
                };
            }

            const dataToUpdate = {
                // documentRequired: Joi.string(),
                description: payload.description,
                status: 'Pending',
                url: payload.url,
                createdAt: payload.createdAt,
            };

            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, {
                'documents.legalDocument.$.url': payload.url,
                'createdAt': payload.createdAt,
                'status': 'Pending',

            });
            // { $set: { "grades.$.std" : 6 } }
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async adminDeleteLoanApplication(payload) {
        try {
            const criteira = {
                _id: payload.loanId
            };
            const dataToUpdate = {
                status: payload.status
            }
            const data = LoanApplicationEntity.updateOneEntity(criteira, dataToUpdate);
            if (!data) {
                return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            }
            return Constant.STATUS_MSG.SUCCESS.S200.DELETED;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // async adminUpdateLoanAmount(payload) {
    //     try {
    //         const data = await LoanApplicationEntity.updateLoanAMount(payload);
    //         return data;

    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }
}
export const LoanController = new LoanControllers();

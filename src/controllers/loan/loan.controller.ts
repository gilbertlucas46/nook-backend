import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as request from 'request';
import * as config from 'config';
import * as Constant from '../../constants/app.constant';
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
            payload['userId'] = userData._id;

            const referenceNumber = await ENTITY.LoanApplicationEntity.getReferenceId(criteria);
            if (!referenceNumber) {
                const year = new Date(new Date().getTime()).getFullYear().toString().substr(-2);
                const month = ('0' + (new Date(new Date().getTime()).getMonth() + 1)).slice(-2);
                const date = ('0' + (new Date(new Date().getTime()).getDate() + 1)).slice(-2);
                const referenceId = 1;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + Contsant.SERVER.LOAN_PRE__ZEOS + referenceId;
                payload['referenceId'] = formattedTime;
            } else {
                const year = new Date(referenceNumber.createdAt).getFullYear().toString().substr(-2);
                const month = new Date(referenceNumber.createdAt).getMonth().toString().substr(-2);
                const date = new Date(referenceNumber.createdAt).getDate().toString().substr(-2);
                const id = referenceNumber['referenceId'].split('-')[2];
                referenceNumber['referenceId']++;
                let num = (parseInt(id) + 1).toString();
                const remainingChars = 4 - num.length;
                for (let i = 0; i < remainingChars; i++) {
                    num = '0' + num;
                }
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + num;
                payload['referenceId'] = formattedTime;
            }

            const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            /**
             * Need to push data to salesforce
             */

            // const salesforceData = {
            //     firstName: data.personalInfo.firstName || '',
            //     middleName: data.personalInfo.middleName || '',
            //     lastName: data.personalInfo.lastName || '',
            //     gender: data.personalInfo.gender || '',
            //     phoneNumber: data.contactInfo.mobileNumber || '',
            //     email: data.contactInfo.email,
            //     referenceId: data.referenceId,
            //     createdAt: data.createdAt,
            // };

            // request.post({ url: config.get('zapier_loanUrl'), formData: salesforceData }, function optionalCallback(err, httpResponse, body) {
            //     if (err) { return console.log(err); }
            //     console.log('body ----', body);
            // });
            return data['referenceId'];

        } catch (error) {
            console.log('Error ', error);
            return Promise.reject(error);
        }
    }
    /**
     * @function updateLoanApplication
     * @description updateLoanApplication before submitted
     * @payload :AddLoan
     * return {data}
     */

    async updateLoanApplication(payload: LoanRequest.AddLoan) {
        try {
            if (payload.saveAsDraft) {
                payload['applicationStatus'] = Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value;
            }
            const data = await ENTITY.LoanApplicationEntity.updateLoanApplication(payload);
            return data['referenceId'];
        } catch (error) {
            console.log('Error ', error);
            return Promise.reject(error);
        }
    }
    /**
     * @function checkPreloanApplication
     * @description pre loan conditions
     * @payload :
     * return []
     */

    async checkPreloanApplication(payload) {
        try {
            return await LoanEntity.preloan(payload);
        } catch (error) {
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
            const criteria = { _id: payload.loanId };
            const data = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, {});
            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E400.INVALID_ID);
            else return data;
        } catch (error) {
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
            dataToUpdate.$set = { applicationStatus: payload.status };
            dataToUpdate.$push = {
                approvedBy: {
                    adminId: adminData._id,
                    adminName: adminData ? adminData.name : '',
                    approvedAt: new Date().getTime(),
                },
            };
            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E400.INVALID_ID);
            else return data;
        } catch (error) {
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
            bankList.sort(shufflefunc);
            function shufflefunc(a: {}, b: {}) {
                return 0.5 - Math.random();
            }
            return bankList;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const LoanController = new LoanControllers();
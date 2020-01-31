import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as Constant from '../../constants/app.constant';
import * as utils from 'src/utils';


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
            payload['userId'] = userData._id;
            const criteria1 = ({
                createdAt: {
                    $gte: new Date(new Date(new Date().setHours(0)).setMinutes(0)).setMilliseconds(0),
                },
            });

            const referenceNumber = await ENTITY.LoanApplicationEntity.getReferenceId(criteria1);
            console.log('new Datenew Datenew Date', new Date());
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
            const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);

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

    async updateLoanApplication(payload: LoanRequest.AddLoan) {
        try {
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

    async checkPreloanApplication(payload) {
        try {
            return await LoanEntity.preloan(payload);
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
            const criteria = { _id: payload.loanId };
            const data = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, {});
            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND);
            else return data;
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
            dataToUpdate.$set = { applicationStatus: payload.status };
            dataToUpdate.$push = {
                approvedBy: {
                    adminId: adminData._id,
                    adminName: adminData ? adminData.name : '',
                    approvedAt: new Date().getTime(),
                },
            };
            const data = await ENTITY.LoanApplicationEntity.updateOneEntity(criteria, dataToUpdate);
            if (!data) return Promise.reject(Contsant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND);
            else return data;
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
}
export const LoanController = new LoanControllers();

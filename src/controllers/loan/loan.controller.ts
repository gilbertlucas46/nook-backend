import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as utils from '@src/utils';
import * as Contsant from '@src/constants/app.constant';
// import { DAOManager } from '@src/databases/dao';

class LoanControllers extends BaseEntity {

    async addLoanRequirements(payload: any) {
        try {
            const bankData = await ENTITY.LoanEntity.createOneEntity(payload);
            if (bankData) {
                payload.bankId = Types.ObjectId(bankData._id);
                await ENTITY.EligibilityEntity.createOneEntity(payload);
            }
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async addLoanApplication(payload, userData) {
        try {
            const criteria = {
                // createdAt: { $lt: new Date().getTime() },
                saveAsDraft: { $ne: true },
            };
            payload['userId'] = userData._id;
            // payload['createdAt'] = new Date().getTime();
            // payload['updatedAt'] = new Date().getTime();
            // const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            const refrenceNumber = await ENTITY.LoanApplicationEntity.getRefrenceId(criteria);
            if (!refrenceNumber) {
                const year = new Date(new Date().getTime()).getFullYear().toString().substr(-2);
                const month = ('0' + (new Date(new Date().getTime()).getMonth() + 1)).slice(-2);
                const date = new Date(new Date().getTime()).getDate();
                const refrenceId = 1;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + Contsant.SERVER.LOAN_PRE__ZEOS + refrenceId;
                payload['refrenceId'] = formattedTime;
            } else {
                const year = new Date(refrenceNumber.createdAt).getFullYear().toString().substr(-2);
                const month = new Date(refrenceNumber.createdAt).getMonth();
                const date = new Date(refrenceNumber.createdAt).getDate();
                const id = refrenceNumber['refrenceId'].split('-')[2];

                refrenceNumber['refrenceId']++;
                let num = (parseInt(id) + 1).toString();
                const remainingChars = 4 - num.length;
                for (let i = 0; i < remainingChars; i++) {
                    num = '0' + num;
                }
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + num;
                payload['refrenceId'] = formattedTime;
            }
            console.log('payloadpayloadpayloadpayloadpayloadpayload', payload);

            const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            console.log('data>>>>>>>>>>>>>>>>>>>>>.', data);

            return data['refrenceId'];

        } catch (error) {
            console.log('error>>>>>>>>>>>>>>>>>', error);

            return Promise.reject(error);
        }
    }

    async updateLoanApplication(payload) {
        try {
            await ENTITY.LoanApplicationEntity.updateLoanApplication(payload);
            return {};
        } catch (error) {

        }
    }

    async checkPreloanApplication(payload) {
        try {
            const bankList = await LoanEntity.preloan(payload);
            return bankList;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async userLoansList(payload, userData) {
        try {
            console.log('payloadpayload', payload);

            return await ENTITY.LoanApplicationEntity.getUserLoanList(payload, userData);
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

// const shortId: string = new Date(refrenceNumber.createdAt).shortId();            // const id: string = `${a.getFullYear}`
// Date.prototype.shortId = function(this: Date) {
//     return `${this.getFullYear().toString().substr(-2)}${this.getMonth()}${this.getDate()}`;
// };
// return refrenceNumber;
// return data['referenceId'];

export const LoanController = new LoanControllers();
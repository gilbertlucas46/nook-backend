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

    async addLoanApplication(payload) {
        try {
            // const data = utils.generateRandomString(Contsant.SERVER.RANDOM_NUMBER);
            const criteria = {
                createdAt: { $lt: new Date().getTime() },
                // saveAsDraft: { $ne: true },
            };
            payload['createdAt'] = new Date().getTime();
            payload['updatedAt'] = new Date().getTime();

            // const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            const refrenceNumber = await ENTITY.LoanApplicationEntity.getOneEntity(criteria, { refrenceId: 1, createdAt: 1 });
            console.log('refrenceNumberrefrenceNumber', refrenceNumber);
            if (!refrenceNumber) {
                const year = new Date().getFullYear().toString().substr(-2);
                const month = ('0' + (new Date().getMonth() + 1)).slice(-2);
                // + ('0' + today.getDate()).slice(-2)
                const date = new Date().getDate();
                const refrenceId = 1;
                payload['refrenceId'] = 1;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + refrenceId;
                console.log('formattedTime>>>>>>>>.....', formattedTime);

                const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
                return formattedTime;

            } else {
                const year = new Date(refrenceNumber.createdAt).getFullYear().toString().substr(-2);
                const month = new Date(refrenceNumber.createdAt).getMonth();
                const date = new Date(refrenceNumber.createdAt).getDate();
                console.log('formattedTimeformattedTimeformattedTimeformattedTime', refrenceNumber['refrenceId']);

                refrenceNumber['refrenceId']++;
                const formattedTime = Contsant.SERVER.HLA + '-' + year + month + date + '-' + refrenceNumber['refrenceId'];
                console.log('formattedTimeformattedTimeformattedTimeformattedTime', formattedTime);

                // const data = await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);

                console.log('formattedTimeformattedTime', formattedTime);

            }

            // const shortId: string = new Date(refrenceNumber.createdAt).shortId();            // const id: string = `${a.getFullYear}`

            // console.log(new Date().getFullYear().toString().substr(-2));
            // console.log('shortIdshortId', shortId);


            // Date.prototype.shortId = function(this: Date) {
            //     return `${this.getFullYear().toString().substr(-2)}${this.getMonth()}${this.getDate()}`;
            // };

            console.log('refrenceNumberrefrenceNumber', refrenceNumber);
            // if (!refrenceNumber) {
            //     const createRefrence = Contsant.SERVER.HLA;
            // }
            return refrenceNumber;

            // if (!refrenceNumber.refrenceNumbe) {

            // };

            // return data['referenceId'];

        } catch (error) {
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

}
export const LoanController = new LoanControllers();
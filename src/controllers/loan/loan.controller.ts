import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';

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
            await ENTITY.LoanApplicationEntity.saveLoanApplication(payload);
            return {};
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
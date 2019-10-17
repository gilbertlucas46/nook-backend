import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
import { DAOManager } from '@src/databases/dao';
import { UserEmployment } from '@src/models';
import { BaseEntity } from '@src/entity/base/base.entity';

class LoanControllers extends BaseEntity {

    async addLoanRequirements(payload: any) {
        try {
            // for (let i = 0; i < payload.bankPayload.length; i++) {
                let bankData = await ENTITY.LoanEntity.createOneEntity(payload);
                if (bankData) {
                    payload.bankId = Types.ObjectId(bankData._id);
                    await ENTITY.EligibilityEntity.createOneEntity(payload);
                }
            // }
            return;
        } catch (error) {
            return Promise.reject(error)
        }
    }

}

export const LoanController = new LoanControllers();
import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { loanReferralRequest } from '@src/interfaces/loanReferral.interface';
class Referal extends BaseEntity {
    // constructor() { }

    async createReferral(payload: loanReferralRequest.CreateReferral, userData) {
        try {
            payload['userId'] = userData._id;
            await ENTITY.ReferalE.createReferral(payload);
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getReferral(payload: loanReferralRequest.GetReferral) {
        try {
            await ENTITY.ReferalE.getReferral(payload);
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async getUserReferral(payload, userData) {
        try {
            const data = await ENTITY.ReferalE.getUserReferral(payload, userData);
            return data;
        } catch (error) {
            return Promise.reject(error);

        }
    }
}
export const referralController = new Referal();

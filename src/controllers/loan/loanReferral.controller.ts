import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { loanReferralRequest } from '@src/interfaces/loanReferral.interface';
class Referal extends BaseEntity {
    // constructor() { }
    /**
     * @function loanShuffle
     * @description  user send the info of the another user to admin
     * @payload :CreateReferral
     * return {success/error}
     */

    async createReferral(payload: loanReferralRequest.CreateReferral, userData) {
        try {
            payload['userId'] = userData._id;
            await ENTITY.ReferalE.createReferral(payload);
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @function loanShuffle
     * @description  info of the referral by id
     * @payload :GetReferral
     * return {success/error}
     */

    async getReferral(payload: loanReferralRequest.GetReferral) {
        try {
            await ENTITY.ReferalE.getReferral(payload);
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @function getUserReferral
     * @description  user Referral list
     * @payload :IUserLoanRefferal
     * return []
     */
    async getUserReferral(payload: loanReferralRequest.IUserLoanRefferal, userData) {
        try {
            return await ENTITY.ReferalE.getUserReferral(payload, userData);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const referralController = new Referal();
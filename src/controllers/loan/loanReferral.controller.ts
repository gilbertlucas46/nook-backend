import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import { loanReferralRequest } from '@src/interfaces/loanReferral.interface';
import * as utils from '@src/utils';
import * as config from 'config';
import fetch from 'node-fetch';

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
            const data = await ENTITY.ReferalE.createReferral(payload);
            const salesforceData = {
                sendBy: userData.email,
                senderFirstName: userData.firstName,
                senderLastName: userData.lastName,
                senderMiddleName: userData.middleName,
                senderUserName: userData.userName,
                senderPhoneNumber: userData.phoneNumber,
                email: data.email,
                notes: data.notes,
                lastName: data.lastName,
                firstName: data.firstName,
                mobileNo: data.phoneNumber,
                countryCode: data.countryCode,
            };
            const request = {
                method: 'post',
                body: JSON.stringify(salesforceData),
            };
            // console.log("Referal  salesforceData========>>>>> ",salesforceData);
            await fetch(config.get('zapier_referralUrl'), request);
        } catch (error) {
            utils.consolelog('error', error, true);
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
            utils.consolelog('error', error, true);
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
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getAdminReferral(payload, adminData) {
        try {
            const data = await ENTITY.ReferalE.getAdminData(payload, adminData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateReferral(payload, adminData) {
        try {
            const criteria = {
                _id: payload.id,
            };
            const dataToSet: any = {};
            dataToSet.$set = {
                ...payload,
            };
            dataToSet.$push = {
                status: payload.staffStatus,
                staffId: adminData._id,
                seenAt: new Date().getTime(),
                stafName: adminData.firstName,
                message: payload.message || '',
            };
            // const [message] = payload;
            const data = await ENTITY.ReferalE.updateOneEntity(criteria, dataToSet);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const referralController = new Referal();
import * as ENTITY from '@src/entity';
import { PartnerAdminRequest } from '@src/interfaces/partner.interface';
import * as Constant from '../../constants';
import * as utils from '@src/utils';

export class Partner {

    getTypeAndDisplayName(findObj, num) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }

    async createPartner(payload: PartnerAdminRequest.CreatePartner, adminData) {
        try {
            const criteria = {
                name: payload.name,
            };
            payload['addedBy'] = adminData._id;
            let data;
            const checkData = await ENTITY.PartnerE.getOneEntity(criteria, {});
            if (!checkData) {
                data = await ENTITY.PartnerE.createOneEntity(payload);
                console.log('datadatadatadatadatadata', data);

            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description user get the partner info
     */

    async  getPartnerInfo(payload) {
        try {
            const criteria = {
                shortId: payload.partnerSid,
                status: Constant.DATABASE.PartnerStatus.ACTIVE,
            }
            const data = await ENTITY.PartnerE.getOneEntity(criteria, {});
            if (!data) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            }
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export let PartnerService = new Partner();
import * as ENTITY from '@src/entity'
import { BaseEntity } from '@src/entity/base/base.entity';
import { PreQualificationBankE } from '@src/entity/loan/prequalification.entity';
import * as CONSTANT from '../../constants';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';
class PreqQualificationController extends BaseEntity {

    /**
     * @function addPrequalified Banks
     * @description
     * @payload : ''
     * return
     */

    async addPreQualifiedBanks(payload, userData) {
        try {

            // const savePrQualification = await ENTITY.PreQualificationBankE.createMulti(dataToSave);
            const data = await ENTITY.PreQualificationBankE.addBanks(payload, userData);
            // console.log('savePrQualificationsavePrQualificationsavePrQualification', savePrQualification);
            return {};
            return CONSTANT.STATUS_MSG.ERROR.E400.DB_ERROR;
        } catch (error) {
            return Promise.reject(error);
        }
    }



    /**
     *
     */
    async preQualificationList(payload, adminData) {
        try {
            const data = await PreQualificationBankE.preloanList(payload, adminData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getPreQualifiedBanks(payload: PreQualificationRequest.IPrequalificationList, userData) {
        try {
            const data = await PreQualificationBankE.userPreLoanList(payload, userData);

            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const PreQualificationService = new PreqQualificationController();

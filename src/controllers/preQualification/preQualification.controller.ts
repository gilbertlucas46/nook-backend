import * as ENTITY from '@src/entity'
import { BaseEntity } from '@src/entity/base/base.entity';
import { PreQualificationBankE } from '@src/entity/loan/prequalification.entity';
import * as CONSTANT from '../../constants'
class PreqQualificationController extends BaseEntity {

    /**
     * @function addPrequalified Banks
     * @description
     * @payload : ''
     * return
     */

    async addPreQualifiedBanks(payload, userData) {
        try {
            const dataToSave = {
                userId: userData._id,
                prequalifiedBanks: payload.prequalifiedBanks,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
            };
            const savePrQualification = await ENTITY.PreQualificationBankE.createMulti(dataToSave);
            console.log('savePrQualificationsavePrQualificationsavePrQualification', savePrQualification);
            if (savePrQualification) {
                return {};

            }
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
}
export const PreQualificationService = new PreqQualificationController();

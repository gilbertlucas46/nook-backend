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

    /**
     * @description A function to add the user prequalification list
     * @param {NextFunction} res A callback function to call next handler
     */


    async addPreQualifiedBanks(payload: PreQualificationRequest.IPreLoanAdd, userData) {
        try {
            const data = await ENTITY.PreQualificationBankE.addBanks(payload, userData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }


    async adminAddPreQualifiedBanks(payload: PreQualificationRequest.IPreLoanAdd, userData) {
        try {
            const data = await ENTITY.PreQualificationBankE.adminAddBanks(payload, userData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }



    /**
     *  @description admin get prequalification List
     *  funcction to be removeds after check
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

    async preQualificationById(payload, userData) {
        try {
            const criteria = {
                _id: payload.id,
                userId: userData._id,
            };
            const data = await PreQualificationBankE.getOneEntity(criteria, {});
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export const PreQualificationService = new PreqQualificationController();
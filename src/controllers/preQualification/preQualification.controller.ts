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
    async getPreQualifiedBanksList(payload: PreQualificationRequest.IPrequalificationList) {
        try {
            const data = await PreQualificationBankE.adminUserPreLoanList(payload);

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


    async adminDeletePrequalification(payload,adminData) {
        try {
            if (adminData.type === CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE) {
                return Promise.reject(CONSTANT.STATUS_MSG.ERROR.E400.PERMISSION_DENIED);
				 }
            const criteira = {
                _id: payload.Id
            };
            const dataToUpdate = {
                status: CONSTANT.DATABASE.PREQUALIFICATION_STATUS.DELETE,
            }
            const data = ENTITY.PreQualificationBankE.updateOneEntity(criteira, dataToUpdate);
            if (!data) {
                return CONSTANT.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            }
            return CONSTANT.STATUS_MSG.SUCCESS.S200.DELETED;
        } catch (error) {
            return Promise.reject(error);

        }
    }
}
export const PreQualificationService = new PreqQualificationController();
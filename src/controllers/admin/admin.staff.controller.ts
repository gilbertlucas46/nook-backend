import * as CONSTANT from '../../constants';
import * as ENTITY from '../../entity';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils/index';
import * as UniversalFunctions from '@src/utils';
import * as config from 'config';
import { generateRandomString } from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
const cert: any = config.get('jwtSecret');

/**
 * @author Ashish Jain
 * @description this controller contains actions for admin's staff related activities
 */
class AdminStaffControllers {

    async createStaff(payload: AdminRequest.IaddSubAdmin) {
        try {
            const email: string = payload.email;
            const checkEmail = await ENTITY.AdminStaffEntity.checkStaffEmail(email);
            console.log('checkEmailcheckEmailcheckEmailcheckEmail', checkEmail);

            if (!checkEmail) {
                const generateString = generateRandomString(4);
                const genCredentials = `${(payload.firstName).replace(/ /g, '')}${generateString}`;
                const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                const datatoSave = {
                    email: payload.email,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    password: hashPassword,
                    phoneNumber: payload.phoneNumber,
                    // staffStatus: Constant.DATABASE.STATUS.ADMIN.  ,
                    type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
                    permission: payload.permission,
                };
                await ENTITY.AdminStaffEntity.createOneEntity(datatoSave);
                ENTITY.AdminStaffEntity.sendInvitationMail(payload.email, genCredentials);
                return;
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.REQUEST_ALREADY_SENT);
            }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async updateStaff(payload: AdminRequest.IadminUpdatePermission) {
        try {
            let dataToUpdate: any;
            dataToUpdate = {
                $set: {
                    ...payload,
                },
            };

            return await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload.id }, dataToUpdate);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @description Resend the mail and update the password
     * @param payload
     */
    async systemGeneratedMail(payload: any) {
        try {
            const fetchEmail = await ENTITY.AdminStaffEntity.fetchAdminEmail(payload._id);
            if (!fetchEmail) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E406.STAFF_ALREADY_LOGGED_IN);
            } else {
                const generateString = generateRandomString(4);
                const genCredentials = `${payload.firstName}_${generateString}`;
                const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload.adminId }, { $set: { password: hashPassword } });
                // ENTITY.AdminStaffEntity.sendInvitationMail(payload.email, genCredentials);
                return {};
            }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    // async deleteStaff(payload: any, adminData: any) {
    //     try {
    //         if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
    //             return Promise.reject(Constant.STATUS_MSG.ERROR.E401);
    //         } else {
    //             await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload.id }, { staffStatus: CONSTANT.DATABASE.STATUS.USER.DELETED });
    //             return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {});
    //         }
    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }

    async getStaffList(payload) {
        try {
            const staffList = await ENTITY.AdminStaffEntity.staffListing(payload);
            return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, staffList);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let AdminStaffController = new AdminStaffControllers();
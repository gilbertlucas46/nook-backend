import * as ENTITY from '../../entity';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils/index';
import * as UniversalFunctions from '@src/utils';
import * as config from 'config';
import { generateRandomString } from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { AdminUserEntity } from '@src/entity';
const cert: any = config.get('jwtSecret');

/**
 * @author Anurag Agarwal
 * @description this controller contains actions for user management in admin/staff
 */
class AdminUserControllers {

    async createUser(payload: AdminRequest.IcreateUser) {
        try {
            const checkMail = { email: payload.email.trim().toLowerCase() };
            const checkUserName = { userName: payload.userName.trim().toLowerCase() };
            const userNameCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
            if (userNameCheck && userNameCheck._id) {
                return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
            } else {
                const UserCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN;
                } else {
                    const generateString = generateRandomString(4);
                    const genCredentials = `${(payload.userName).replace(/ /g, '')}${generateString}`;
                    const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                    const userData = {
                        userName: payload.userName.trim().toLowerCase(),
                        email: payload.email.trim().toLowerCase(),
                        password: hashPassword,
                        isEmailVerified: true,
                        isProfileComplete: false,
                        type: payload.type,
                    };
                    const User: AdminRequest.IcreateUser = await ENTITY.UserE.createOneEntity(userData);
                    const userResponse = UniversalFunctions.formatUserData(User);
                    AdminUserEntity.sendInvitationMail(payload.email, genCredentials);
                    return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
                }
            }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    // async deleteUser(payload: any, adminData: any) {
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

    async getUserList(payload: AdminRequest.IsearchUser) {
        try {
            const userList = await AdminUserEntity.getUserList(payload);
            return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, userList);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let AdminUserController = new AdminUserControllers();
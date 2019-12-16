import * as ENTITY from '../../entity';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils/index';
import * as UniversalFunctions from '@src/utils';
import * as config from 'config';
import { generateRandomString } from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { AdminUserEntity } from '@src/entity';
import { PromiseProvider } from 'mongoose';
import { isDate } from 'util';
const cert: any = config.get('jwtSecret');

/**
 * @author Anurag Agarwal
 * @description this controller contains actions for user management in admin/staff
 */
class AdminUserControllers {
    getTypeAndDisplayName(findObj, num: number) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }

    async addUser(payload) {
        try {
            console.log('payloadpayloadpayloadpayloadpayload', payload);

            const checkMail = { email: payload.email };
            const checkUserName = { userName: payload.userName };
            const userNameCheck: AdminRequest.IAddUser = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
            if (userNameCheck && userNameCheck._id) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
            } else {
                const UserCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
                } else {
                    const generateString = generateRandomString(4);
                    const genCredentials = `${(payload.userName).replace(/ /g, '')}${generateString}`;
                    const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                    const userData = {
                        ...payload,
                        // userName: payload.userName,
                        // email: payload.email,
                        password: hashPassword,
                        isEmailVerified: true,
                        isProfileComplete: true,
                        // type: payload.type,
                        // language: payload.language,
                        // title: payload.title,
                        // license: payload.license,
                        // companyName: payload.companyName,
                        // address: payload.address,
                        // aboutMe: payload.aboutMe,
                    };
                    console.log('userDatauserDatauserDatauserData', userData);
                    const User: AdminRequest.IcreateUser = await ENTITY.UserE.createOneEntity(userData);
                    const userResponse = UniversalFunctions.formatUserData(User);
                    AdminUserEntity.sendInvitationMail(payload.email, genCredentials);
                    return userResponse;
                }
            }
        } catch (error) {
            console.log('errorerrorerrorerror', error);
            return Promise.reject(error);
        }
    }

    // async createUser(payload: AdminRequest.IcreateUser) {
    //     try {
    //         const checkMail = { email: payload.email.trim().toLowerCase() };
    //         const checkUserName = { userName: payload.userName.trim().toLowerCase() };
    //         const userNameCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
    //         if (userNameCheck && userNameCheck._id) {
    //             return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
    //         } else {
    //             const UserCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
    //             if (UserCheck && UserCheck._id) {
    //                 return Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN;
    //             } else {
    //                 const generateString = generateRandomString(4);
    //                 const genCredentials = `${(payload.userName).replace(/ /g, '')}${generateString}`;
    //                 const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
    //                 const userData = {
    //                     userName: payload.userName.trim().toLowerCase(),
    //                     email: payload.email.trim().toLowerCase(),
    //                     password: hashPassword,
    //                     isEmailVerified: true,
    //                     isProfileComplete: false,
    //                     type: payload.type,
    //                 };
    //                 const User: AdminRequest.IcreateUser = await ENTITY.UserE.createOneEntity(userData);
    //                 const userResponse = UniversalFunctions.formatUserData(User);
    //                 AdminUserEntity.sendInvitationMail(payload.email, genCredentials);
    //                 return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
    //             }
    //         }
    //     } catch (error) {
    //         utils.consolelog('error', error, true);
    //         return Promise.reject(error);
    //     }
    // }


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

    async getUserList(payload: AdminRequest.IGetUSerList) {
        try {
            const userList = await AdminUserEntity.getUserList(payload);
            return userList;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async updateUser(payload) {
        try {
            const criteria = {
                _id: payload.userId,
            };
            let result;
            const dataToUpdate = {
                status: payload.status,
            };
            const dataToSet: any = {};
            const data = await ENTITY.UserE.updateOneEntity(criteria, dataToUpdate);
            console.log('datadatadatadatadata', data);

            if (payload.status === Constant.DATABASE.STATUS.USER.ACTIVE) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER);
            } else if (payload.status === Constant.DATABASE.STATUS.USER.BLOCKED || payload.status === Constant.DATABASE.STATUS.USER.DELETED) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER);
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PROPERTY_STATUS);
            }
            const propertyCriteria = {
                'property_added_by.userId': payload.userId,
            };

            dataToSet.$set = {
                isUserBlockedByAdmin: payload.status !== payload.status['ACTIVE'],
                property_status: {
                    number: result.NUMBER,
                    status: result.TYPE,
                    displayName: result.DISPLAY_NAME,
                },
                approvedAt: new Date().getTime(),
            };

            ENTITY.PropertyE.updateMultiple(propertyCriteria, dataToSet);
            console.log('dataToUpdatedataToUpdatedataToUpdate', data);
            return data;
        } catch (error) {
            console.log('errorerrorerrorerrorerrorerrorerror', error);

            return Promise.reject(error);
        }
    }
}

export let AdminUserController = new AdminUserControllers();
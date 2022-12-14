import * as ENTITY from '../../entity';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils/index';
import * as UniversalFunctions from '@src/utils';
import { generateRandomString } from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { AdminUserEntity } from '@src/entity';
import { MailManager } from '@src/lib';
import { flattenObject } from '@src/utils/flatten.util';
import fetch from 'node-fetch';
import * as config from 'config';
import { Types } from 'mongoose';
import { LoanApplication } from '@src/models';
import { util } from 'config';
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

    async addUser(payload: AdminRequest.IAddUser) {
        try {
            const checkMail = { email: payload.email };
            // const checkUserName = { userName: payload.userName };
            // // const userNameCheck: AdminRequest.IAddUser = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
            // if (userNameCheck && userNameCheck._id) {
            //     return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
            // } else {
                const UserCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
                } else {
                    const generateString = generateRandomString(4);
                    const genCredentials = `${(payload.firstName).replace(/ /g, '')}${generateString}`;
                    const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                    const userData = {
                        ...payload,
                        password: hashPassword,
                    };
                    const User: AdminRequest.IcreateUser = await ENTITY.UserE.createOneEntity(userData);

                    let userResponse = await UniversalFunctions.formatUserData(User);
                    userResponse = JSON.parse(JSON.stringify(userResponse))
                    userResponse['isNewUser'] = 1;
                    console.log('userResponse', userResponse);
                    delete userResponse['password']
                    const sendObj = {
                        receiverEmail: payload.email,
                        password: genCredentials,
                        userName: payload.firstName + '' + payload.lastName,
                    };

                    const salesforceData = flattenObject(userResponse.toObject ? userResponse.toObject() : userResponse);
                    const request = {
                        method: 'post',
                        body: JSON.stringify(salesforceData),
                    };

                    // SessionE.createSession({}, doc, accessToken, 'user');
                    // const formatedData = utils.formatUserData(doc);

                    // 	receiverEmail: payload.email,
                    // 	subject: 'nook welcomes you',
                    // 	userName: payload.userName,
                    // };
                    if (config.get('environment') === 'production') {
                        console.log('salesforceDatasalesforceData', salesforceData);
                        await fetch(config.get('zapier_personUrl'), request);
                        await fetch(config.get('zapier_accountUrl'), request);
                    }
                    const mail = new MailManager();
                    await mail.welcomeStaffUSer(sendObj);
                    return userResponse;
                }
            //  }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async createUser(payload: AdminRequest.IcreateUser) {
        try {
            const checkMail = { email: payload.email.trim().toLowerCase() };
            // const checkUserName = { userName: payload.userName.trim().toLowerCase() };
            // const userNameCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
            // if (userNameCheck && userNameCheck._id) {
            //     return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
            // } else {
                const UserCheck: AdminRequest.IcreateUser = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
                } else {
                    const generateString = generateRandomString(4);
                    const genCredentials = `${(payload.firstName).replace(/ /g, '')}${generateString}`;
                    const hashPassword = await utils.encryptWordpressHashNode(genCredentials);
                    const userData = {
                        // userName: payload.userName.trim().toLowerCase(),
                        email: payload.email.trim().toLowerCase(),
                        password: hashPassword,
                        // isEmailVerified: true,
                        // isProfileComplete: false,
                        // type: payload.type,
                    };
                    const User: AdminRequest.IcreateUser = await ENTITY.UserE.createOneEntity(userData);
                    const userResponse = UniversalFunctions.formatUserData(User);
                    AdminUserEntity.sendInvitationMail(payload.email, genCredentials);
                    return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
                }
            // }
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }


    async deleteUser(payload: any, adminData: any) {
        try {
            if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E401);
            } else {
                // await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload.id }, { staffStatus: Constant.DATABASE.STATUS.USER.DELETED });
                // return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getUserList(payload: AdminRequest.IGetUSerList) {
        try {
            const userList = await AdminUserEntity.getUserList(payload);
            return userList;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async updateUserStatus(payload) {
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

            dataToSet.$set = {
                isUserBlockedByAdmin: payload.status !== payload.status['ACTIVE'],
                approvedAt: new Date().getTime(),
            };
            // const loanUserCriteria = {
            //     userId: Types.ObjectId(payload.userId),
            // }

            // // if (payload.status === Constant.DATABASE.STATUS.USER.DELETE || payload.status === Constant.DATABASE.STATUS.USER.BLOCKED) {
            // const data1 = await ENTITY.LoanApplicationEntity.updateMultiple(loanUserCriteria, dataToUpdate);
            // // }
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * 
     * @param payload userData
     * @param userId
     */
    async adminGetUser(payload) {
        try {
            const criteria = {
                _id: payload.userId,
            };
            const projection = {
                _id: 1,
                status: 1,
                type: 1,
                // userName: 1,
                email: 1,
                profilePicUrl: 1,
                firstName: 1,
                phoneNumber: 1,
                lastName: 1,
                middleName: 1,
                language: 1,
                aboutMe: 1,
                backGroundImageUrl: 1,
                createdAt: 1,
                updatedAt: 1,
            };
            const data = await ENTITY.UserE.getOneEntity(criteria, projection);
            if (!data) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @description  admin update the user
     * @param payload userId and userData
     */
    async updateUser(payload: AdminRequest.IUpdateUser) {
        try {
            const criteria = {
                _id: payload.userId,
            };
            const getUserData = await ENTITY.UserE.getOneEntity(criteria, {});
            const checkEmailCriteria = {
                email: payload.email,
            };
            // const checkUserName = { userName: payload.userName };
            if (getUserData && getUserData.email !== payload.email) {
                const checkByEmail = await ENTITY.UserE.getOneEntity(checkEmailCriteria, ['_id', 'email']);
                if (checkByEmail && checkByEmail._id) {
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN);
                }
            }
            // if (getUserData && getUserData.userName !== payload.userName) {
            //     const checkByUserName = await ENTITY.UserE.getOneEntity(checkUserName, ['_id', 'userName']);
            //     if (checkByUserName && checkByUserName._id) {
            //         return Promise.reject(Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN);
            //     }
            // }
            const updatedUser = await ENTITY.UserE.updateOneEntity(criteria, payload, { lean: true, new: true });

            if (updatedUser.email !== getUserData.email) {
                console.log(':::::::::::::');
                const loan = await ENTITY.LoanApplicationEntity.updateMultiple({ userId: payload.userId }, { 'contactInfo.email': payload.email })
                const preqQualification = await ENTITY.PreQualificationBankE.updateMultiple({ userId: payload.userId }, { email: payload.email });
            }

            const userResponse = UniversalFunctions.formatUserData(updatedUser);

            userResponse['isNewUser'] = 0;

            if (config.get('environment') === 'production') {
                // if (!isProfileCompleted) {
                // convert document to data
                const salesforceData = flattenObject(userResponse.toObject ? userResponse.toObject() : userResponse);
                const request = {
                    method: 'post',
                    body: JSON.stringify(salesforceData),
                };
                if (config.get('environment') === 'production') {
                    console.log('salesforceDatasalesforceData', salesforceData);
                    await fetch(config.get('zapier_personUrl'), request);
                    await fetch(config.get('zapier_accountUrl'), request);
                }
            }


            return userResponse;
        }
        catch (error) {
            utils.errorReporter(error);
            return Promise.reject(error);
        }
    }
}
export let AdminUserController = new AdminUserControllers();
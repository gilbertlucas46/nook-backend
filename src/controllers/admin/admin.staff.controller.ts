import * as CONSTANT from '../../constants';
import * as ENTITY from '../../entity';
import * as Constant from '@src/constants/app.constant';
import * as utils from '../../utils/index';
import * as UniversalFunctions from '@src/utils';
import { Types } from 'mongoose';
import * as config from 'config';
import { generateRandomString } from '../../utils/index';
import { MailManager } from '@src/lib';
const cert: any = config.get('jwtSecret');

/**
 * @author Ashish Jain
 * @description this controller contains actions for admin's staff related activities
 */
class AdminStaffControllers {

    async createStaff(payload: any) {
        try {
            const email: string = payload.email;
            const checkEmail = await ENTITY.AdminStaffEntity.checkStaffEmail(email);
            if (!checkEmail) {
                const generateString = generateRandomString(4);
                const genCredentials = `${payload.firstName}_${generateString}`;
                const hashPassword = await utils.cryptData(genCredentials);

                const datatoSave = {
                    email: payload.email,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    password: hashPassword,
                    phoneNumber: payload.phoneNumber,
                    staffStatus: Constant.DATABASE.STATUS.USER.ACTIVE,
                    type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
                };
                await ENTITY.AdminStaffEntity.createOneEntity(datatoSave);
                const html = `<html><head><title> Nook Admin | Staff Credentials</title></head>
                    <body>
                    Your system generated password is : '${genCredentials}'
                    <p>Login with your email and password sent above.</p>
                    </body>
                    </html>`;
                const mail = new MailManager(payload.email, 'Staff Login Credentials', html);
                mail.sendMail();
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {});
            } else {
                return Constant.STATUS_MSG.ERROR.E400.REQUEST_ALREADY_SENT;
            }
        } catch (error) {
            return Promise.reject(error);
        }

    }

    async addPermissions(payload: any) {
        try {
            const dataToUpdate = {
                $addToSet: {
                    permission: payload.permission,
                },
            };
            await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload._id }, dataToUpdate);
            return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200, {});
        } catch (error) {
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
            if (fetchEmail) {
                const generateString = generateRandomString(4);
                const genCredentials = `${payload.firstName}_${generateString}`;
                const hashPassword = await utils.cryptData(genCredentials);
                const html = `<html><head><title> Nook Admin | Staff Credentials</title></head>
                    <body>
                    Your system generated password is : '${genCredentials}'
                    <p>Login with your email and password sent above.</p>
                    </body>
                    </html>`;
                const mail = new MailManager(payload.email, 'Staff Login Credentials', html);
                mail.sendMail();
                await ENTITY.AdminStaffEntity.updateOneEntity(
                    { _id: Types.ObjectId(payload._id) },
                    {
                        $set: {
                            password: hashPassword,
                        },
                    },
                );
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteStaff(payload: any, adminData: any) {
        try {
            if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E401);
            } else {
                await ENTITY.AdminStaffEntity.updateOneEntity({ _id: payload._id }, { staffStatus: CONSTANT.DATABASE.STATUS.USER.DELETED });
                return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, {});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getStaffList(payload) {
        try {
            const staffList = await ENTITY.AdminStaffEntity.staffListing(payload);
            return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, staffList);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let AdminStaffController = new AdminStaffControllers();
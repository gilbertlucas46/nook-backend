import * as config from 'config';
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from "../../utils/index";
import * as Jwt from 'jsonwebtoken';
const cert = config.get('jwtSecret');
import { MailManager } from '../../lib/mail.manager';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminController {
    constructor() { }

    async login(payload: AdminRequest.login) {
        try {
            let email = payload.email;
            if (email) email = email.trim().toLowerCase();
            // used to fetch the admin details from the database
            let checkData = { email };
            let adminData = await ENTITY.AdminE.getOneEntity(checkData, ['password', '_id', 'email']);
            // check email
            if (!adminData) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            if (!(await utils.deCryptData(payload.password, adminData.password))) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
            let sessionData = { adminId: adminData._id }
            let sessionObj = await ENTITY.AdminSessionE.createSession(sessionData);
            let tokenObj = {
                adminId: adminData._id,
                sessionId: sessionObj._id
            }
            let accessToken = await ENTITY.AdminE.createToken(tokenObj);
            return { formatedData: adminData, accessToken: accessToken };
        } catch (err) {
            return Promise.reject(err)
        }
    }


    async profile(payload) {
        try {
            let criteria = {
                _id: payload._id
            }
            let adminData = await ENTITY.AdminE.getData(criteria, ["email", "_id", "phoneNumber", "countryCode"]);
            return adminData;

        } catch (err) {
            return Promise.reject(err);
        }
    }

    async editProfile(payload: AdminRequest.ProfileUpdate) {
        try {

            let criteria = {
                _id: payload._id
            }
            let updateAdmin = await ENTITY.AdminE.updateOneEntity(criteria, payload);
            return updateAdmin;

        } catch (err) {
            return Promise.reject(err);
        }
    }

    async forgetPassword(payload: AdminRequest.ForgetPassword) {
        try {
            let criteria = {
                email: payload.email.trim().toLowerCase()
            };
            let adminData = await ENTITY.AdminE.getData(criteria, ["email", "_id"]);
            if (!adminData) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            else {
                let passwordResetToken = await ENTITY.AdminE.createPasswordResetToken(adminData);
                let url = config.get("host") + "/v1/user/verifyLink/" + passwordResetToken
                let html = '<html><head><title> Nook Admin | Forget Password</title></head><body>Please click here : <a href="' + url + '">click</a></body></html>'
                let mail = new MailManager(payload.email, "forget password", html);
                mail.sendMail();
                return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async changePassword(payload: AdminRequest.ChangePassword, adminData: AdminRequest.adminData) {
        try {
            let criteria = {
                _id: adminData._id
            }
            let password = await ENTITY.AdminE.getOneEntity(criteria, ['password']);
            if (!(await utils.deCryptData(payload.oldPassword, password.password))) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD)
            else {
                let updatePswd = {
                    password: await utils.cryptData(payload.newPassword),
                    updatedAt: new Date().getTime()
                }
                let updatePassword = await ENTITY.AdminE.updateOneEntity(criteria, updatePswd)
                if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR)
                else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async verifyLinkForResetPwd(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'], });
            if (!result) return Promise.reject();
            let checkAlreadyUsedToken: any = await ENTITY.AdminE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken'])
            if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null)
                return Promise.reject("Already_Changed") // send the error page that the already change the pssword in case of already changes fromthe browser

            let updatePswd = {
                password: await utils.cryptData(payload.password),
                updatedAt: new Date().getTime(),
                passwordResetTokenExpirationTime: null,
                passwordResetToken: null
            }
            let today: any = new Date();
            let diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes in negative minus
            if (diffMins > 0) return Promise.reject("Time_Expired")
            else {
                let updatePassword = await ENTITY.AdminE.updateOneEntity({ email: result }, updatePswd)
                if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }
        } catch (error) {
            utils.consolelog('error', error, true)
            return Promise.reject(error)
        }
    }

    async verifyLink(payload) {
        try {
            let result = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
            let adminData = await ENTITY.AdminE.getOneEntity(result.email, {})
            if (!adminData) return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR // error page will be open here
            else {
                let criteria = { email: result }
                let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken']
                let userExirationTime: any = await ENTITY.AdminE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken'])

                let today: any = new Date();
                let diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                if (diffMins > 0) return Promise.reject('LinkExpired')
                else return {} // success
            }
        } catch (error) {
            utils.consolelog('error', error, true)
            return Promise.reject(error)
        }
    }
}

export let AdminProfile = new AdminController();


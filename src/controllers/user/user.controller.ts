
import * as config from 'config';
import * as UniversalFunctions from '../../utils'
import * as Constant from '../../constants/app.constant'
import * as ENTITY from '../../entity'
import * as utils from "../../utils/index";
import * as Jwt from 'jsonwebtoken';
const cert = config.get('jwtSecret');
import { MailManager } from '../../lib/mail.manager'
export class UserController {
    constructor() { }

    async register(payload: UserRequest.Register) {
        try {
            let checkMail = {
                email: payload.email
            }
            let checkUserName = {
                userName: payload.userName
            }
            let userNameCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id'])
            if (userNameCheck && userNameCheck._id) {
                return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN
            } else {
                let UserCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN
                } else {
                    let makePassword = await utils.cryptData(payload.password);
                    let userData = {
                        userName: payload.userName,
                        email: payload.email,
                        password: makePassword,
                        createdAt: new Date().getTime(),
                        updatedAt: new Date().getTime(),
                        isEmailVerified: true,
                        isProfileComplete: false
                    }
                    let User: UserRequest.Register = await ENTITY.UserE.createOneEntity(userData);
                    let userResponse = UniversalFunctions.formatUserData(User);
                    return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse)
                }
            }

        } catch (error) {
            return Promise.reject(error)
        }
    }

    async login(payload: UserRequest.Login) {
        try {
            let checkEmail = {
                email: payload.email
            }
            let checkData = { $or: [{ email: payload.email }, { userName: payload.email }] };
            let userData = await ENTITY.UserE.getOneEntity(checkData, {});
            if (userData && userData._id) {

                if (userData.isEmailVerified) {
                    if (!(await utils.deCryptData(payload.password, userData.password))) {
                        return Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD
                    } else {
                        let accessToken = await ENTITY.UserE.createToken(payload, userData);
                        await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
                        let formatedData = await utils.formatUserData(userData);
                        return { formatedData: formatedData, accessToken: accessToken };
                    }
                } else {
                    let accessToken = await ENTITY.UserE.createToken(payload, userData);
                    await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
                    let formatedData = await utils.formatUserData(userData);
                    return { formatedData: formatedData, accessToken: accessToken };
                }
            } else {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_LOGIN
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }
    async portpertyDetail(payload: PropertyRequest.PropertyDetail) {
        try {
            let criteria = {
                _id: payload._id
            }
            if (payload._id.length < 24 && payload._id.length > 24) {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_ID
            }
            let getDetail = await ENTITY.PropertyE.getOneEntity(criteria, {});
            if (getDetail == null) {
                return Constant.STATUS_MSG.ERROR.E400.PROPERTY_NOT_REGISTERED
            }
            return getDetail;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async updateProfile(payload: UserRequest.ProfileUpdate, ) {
        try {
            let criteria = {
                _id: payload._id
            }
            let isProfileComplete: boolean;
            if (payload.firstName && payload.lastName && payload.type) {
                payload.isProfileComplete = true;
            } else isProfileComplete = false;

            let updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload)
            return updateUser

        } catch (error) {
            return Promise.reject(error)
        }
    }

    async forgetPassword(payload: UserRequest.ForgetPassword) {
        try {
            let criteria = {
                email: payload.email
            };
            // let userData = await ENTITY.UserE.getOneEntity(criteria, ["email", "_id"]);
            let userData = await ENTITY.UserE.getData(criteria, ["email", "_id"])

            if (userData == null) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            } else {
                let passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
                // let url = config.get("host.node") + "/v1/user/verifyLink/"+passwordResetToken
                let url = "http://localhost:7361" + "/v1/user/verifyLink/" + passwordResetToken
                // let mail = new MailManager(payload.email, "forGet password", url + passwordResetToken);

                // await mail.sendMail();

                return passwordResetToken;
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async changePassword(payload: UserRequest.ChangePassword, userData: UserRequest.userData) {
        try {
            let criteria = {
                _id: userData._id
            }
            let password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
            if (!(await utils.deCryptData(payload.oldPassword, password.password)))
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD)
            else {
                let updatePswd = {
                    password: await utils.cryptData(payload.newPassword),
                    updatedAt: new Date().getTime()
                }
                let updatePassword = await ENTITY.UserE.updateOneEntity(criteria, updatePswd)
                if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR)
                else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async verifyLink(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'] });
            if (result == undefined) return "something went wrong" // error [age will be open]

            let userData = await ENTITY.UserE.getOneEntity(result.email, {})
            if (!userData) {
                return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR // error page will be open here
            } else {
                let criteria = { email: result }
                let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken']
                let userExirationTime: any = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken'])

                let today: any = new Date();
                let diffMs = (today - userExirationTime.passwordResetTokenExpirationTime); // milliseconds between now & Christmas
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

                if (diffMins > Constant.SERVER.OTP_EXPIRATION_TIME) return Constant.STATUS_MSG.ERROR.E401.EMAIL_FORGET_PWD_LINK
                else return {};
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }
    async resetPassword(payload, userData) {
        try {
            let criteria = {
                email: userData._email
            }
            let updatePswd = {
                password: await utils.cryptData(payload.newPassword),
                updatedAt: new Date().getTime()
            }
            let updatePassword = await ENTITY.UserE.updateOneEntity(criteria, updatePswd)
            if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
            else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;

        } catch (error) {
            return Promise.reject(error)
        }
    }
    async verifyLinkForResetPwd(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'] });
            if (result == undefined) return "something went wrong" // error [age will be open]

            let userData = await ENTITY.UserE.getOneEntity(result.email, {})
            if (userData)
                return this.resetPassword(payload, userData)
            else
                return Promise.reject() //  this html page will be rendered
            // return userData
        } catch (error) {
            return Promise.reject(error)
        }
    }
    async sendMail(payload) {
        try {
            let mail = new MailManager(payload.email, "forGet password", 'passwordResetToken');
            await mail.sendMail()
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export let UserService = new UserController();
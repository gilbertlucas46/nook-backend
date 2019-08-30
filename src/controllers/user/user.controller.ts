
import * as config from 'config';
import * as UniversalFunctions from '../../utils'
import * as Constant from '../../constants/app.constant'
import * as ENTITY from '../../entity'
import * as utils from "../../utils/index";
import { userRoute } from '../../routes/user/user.routes';
import { PromiseProvider } from 'mongoose';

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
                let UserCheck: UserRequest.Register = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']) //UserRequest.UserData = await userClass.getOneEntity(criteria, {})        
                if (UserCheck && UserCheck._id) {
                    return Constant.STATUS_MSG.ERROR.ALREADY_EXIST
                } else {
                    let isProfileComplete: boolean

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
                    let User: UserRequest.Register = await ENTITY.UserE.createOneEntity(userData) //UserRequest.UserData = await userClass.getOneEntity(criteria, {})        
                    console.log('UserUserUserUserUserUser', User);

                    let userResponse = UniversalFunctions.formatUserData(User);
                    return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse)
                }
            }
            // let userResponse = UniversalFunctions.formatUserData(createMerchant)
            // return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse)


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
            console.log('userDatauserDatauserData', userData);

            if (userData && userData._id) {

                if (userData.isEmailVerified) {
                    if (!(await utils.deCryptData(payload.password, userData.password))) {
                        return Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD
                    } else {
                        let accessToken = await ENTITY.UserE.createToken(payload, userData);
                        console.log('accessTokenaccessTokenaccessToken', accessToken);

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

            console.log('getDetailgetDetail', getDetail);
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
            // console.log('userDatauserData', userData);
            let criteria = {
                _id: payload._id
            }
            let isProfileComplete: boolean
            if (payload.firstName && payload.lastName && payload.type) {
                payload.isProfileComplete = true;
            } else {
                isProfileComplete = false;
            }
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
            let passwordResetToken: number;


            let userData = await ENTITY.UserE.getOneEntity(criteria, ["email", "_id"]);
            console.log('userDatauserData', userData);

            if (!userData) {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL;
            } else {
                passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
                // let mail = new MailManager(payload.email, Constant.DATABASE.EMAIL_SUBJECT.VERIFY_EMAIL, passwordResetToken);
                // await mail.sendMail(false);
                return passwordResetToken;
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async verifyOtp(payload: UserRequest.VerifyOtp) {
        try {
            let criteria = {
                email: payload.email
            }
            let userAttribute = ['email', 'name', 'passwordResetTokenExpirationTime', 'passwordResetToken']

            let checkAdmin: any = await ENTITY.UserE.getOneEntity(criteria, [userAttribute])
            console.log('checkAdmincheckAdmin>>>>>>>?????????????', checkAdmin);

            var today: any = new Date();
            var diffMs = (today - checkAdmin.passwordResetTokenExpirationTime); // milliseconds between now & Christmas
            // var diffDays = Math.floor(diffMs / 86400000); // days
            // var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            console.log('diffMinsdiffMinsdiffMinsdiffMinsdiffMinsdiffMins', diffMins);

            if (diffMins > Constant.SERVER.OTP_EXPIRATION_TIME) {
                return Constant.STATUS_MSG.ERROR.E401.EMAIL_FORGET_PWD_LINK
            }
            // remove the sessions  
            else if (payload.otp == Constant.SERVER.BY_PASS_OTP) {
                return Constant.STATUS_MSG.SUCCESS.S200.EMAIL_VERIFIED
            }
            else {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_OTP
            }
        } catch (error) {
            return Promise.reject(error)
        }


    }
}


// let checkOtp = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetToken']);
// console.log('checkOtpcheckOtpcheckOtp', checkOtp);
// if (checkOtp) {



// }

export let UserService = new UserController();

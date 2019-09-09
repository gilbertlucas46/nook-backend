
import * as config from 'config';
import * as UniversalFunctions from '../../utils'
import * as Constant from '../../constants/app.constant'
import * as ENTITY from '../../entity'
import * as utils from "../../utils/index";
import * as Jwt from 'jsonwebtoken';
const cert = config.get('jwtSecret');
// var NumberInt = require('mongoose-int32');
import { MailManager } from '../../lib/mail.manager'
import { ObjectId } from 'mongodb';
export class UserController {
    constructor() { }

    async register(payload: UserRequest.Register) {
        try {
            let checkMail = {
                email: payload.email.trim().toLowerCase()
            }
            let checkUserName = {
                userName: payload.userName.trim().toLowerCase()
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
                        userName: payload.userName.trim().toLowerCase(),
                        email: payload.email.trim().toLowerCase(),
                        password: makePassword,
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
            let unique = payload.email;
            // check if entered value is email or username
            let checkEmailOrUserName = (unique) => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(unique).toLowerCase());
            }
            if (checkEmailOrUserName(unique) === true) unique = unique.trim().toLowerCase();
            let checkData = { $or: [{ email: unique }, { userName: payload.email.trim().toLowerCase() }] };
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
            if (!getDetail) return Constant.STATUS_MSG.ERROR.E400.PROPERTY_NOT_REGISTERED;
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

            let updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload);
            return updateUser;

        } catch (error) {
            return Promise.reject(error)
        }
    }

    async forgetPassword(payload: UserRequest.ForgetPassword) {
        try {
            let criteria = {
                email: payload.email.trim().toLowerCase()
            };
            let userData = await ENTITY.UserE.getData(criteria, ["email", "_id"]);
            if (!userData) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_EMAIL);
            }
            else {
                let passwordResetToken = await ENTITY.UserE.createPasswordResetToken(userData);
                let url = config.get("host") + "/v1/user/verifyLink/" + passwordResetToken
                // let url = "http://localhost:7361" + "/v1/user/verifyLink/" + passwordResetToken
                let mail = new MailManager(payload.email, "forGet password", url);
                mail.sendMail();
                return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async changePassword(payload: UserRequest.ChangePassword, userData: UserRequest.userData) {
        try {
            let criteria = {
                _id: userData._id
            }
            let password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
            if (!(await utils.deCryptData(payload.oldPassword, password.password))) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD)
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
            let result = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
            let userData = await ENTITY.UserE.getOneEntity(result.email, {})
            if (!userData) return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR // error page will be open here
            else {
                let criteria = { email: result }
                let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken']
                let userExirationTime: any = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken'])

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

    async verifyLinkForResetPwd(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'], });
            if (!result) return Promise.reject();
            let checkAlreadyUsedToken: any = await ENTITY.UserE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken'])
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
                let updatePassword = await ENTITY.UserE.updateOneEntity({ email: result }, updatePswd)
                if (!updatePassword) return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }

        } catch (error) {
            utils.consolelog('error', error, true)
            return Promise.reject(error)
        }
    }
    async sendMail(payload) {
        try {
            let email = payload.email.trim().toLowerCase();
            let mail = new MailManager(email, "forGet password", 'passwordResetToken');
            await mail.sendMail()
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async dashboard(userData: UserRequest.userData) {
        try {
            let query;
            let pipeline = [
                {
                    "$facet": {
                        "Active": [
                            {
                                "$match": {
                                    $and: [{ "Property_status": "Active" }, { "userId": userData._id }]
                                }
                            },
                            { "$count": "Total" }
                        ],
                        "Featured": [
                            { "$match": { $and: [{ "Property_status": "Featured" }, { "userId": userData._id }] } },
                            { "$count": "Total" },
                        ],
                        "soldPropertyLast30Days": [
                            {
                                "$match": {
                                    $and: [{ "Property_status": "Sold" }, { "userId": userData._id },
                                    { "property_sold_time": { $gte: new Date().getTime() - (15 * 24 * 60 * 60 * 1000) } }
                                    ]
                                }
                            },
                            { "$count": "Total" },
                        ],
                        "rentedPropertyLast30Days": [
                            {
                                "$match": {
                                    $and: [{ "Property_status": "Rent" }, { "userId": userData._id },
                                    { "property_rent_time": { $gte: new Date().getTime() - (15 * 24 * 60 * 60 * 1000) } }
                                    ]
                                }
                            },
                            { "$count": "rentPropertyLast30Days" },
                        ]
                    }
                },
                {
                    "$project": {
                        "Active": {
                            $cond: { if: { $size: "$Active" }, then: { $arrayElemAt: ["$Active.Total", 0] }, else: 0 }
                        },

                        "Featured": {
                            $cond: { if: { $size: ["$Featured"] }, then: { $arrayElemAt: ["$Featured.Total", 0] }, else: 0 }
                        },
                        "soldPropertyLast30Days": {
                            $cond: { if: { $size: ["$soldPropertyLast30Days"] }, then: { $arrayElemAt: ["$soldPropertyLast30Days.Total", 0] }, else: 0 }
                        },
                        "rentedPropertyLast30Days": {
                            $cond: { if: { $size: ["$rentedPropertyLast30Days"] }, then: { $arrayElemAt: ["$rentedPropertyLast30Days.Total", 0] }, else: 0 }
                        }
                    }
                }

            ]
            let data = await ENTITY.UserE.aggregate(pipeline);
            console.log('datadatadatadatadatadata', data);

            return {
                ...data[0],
                isFeaturedProfile: userData.isFeaturedProfile
            };
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export let UserService = new UserController();

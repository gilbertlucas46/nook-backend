"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const UniversalFunctions = require("../../utils");
const Constant = require("../../constants/app.constant");
const ENTITY = require("../../entity");
const utils = require("../../utils/index");
const Jwt = require("jsonwebtoken");
const cert = config.get('jwtSecret');
const mail_manager_1 = require("../../lib/mail.manager");
class UserController {
    constructor() { }
    async register(payload) {
        try {
            let checkMail = {
                email: payload.email.trim().toLowerCase()
            };
            let checkUserName = {
                userName: payload.userName.trim().toLowerCase()
            };
            let userNameCheck = await ENTITY.UserE.getOneEntity(checkUserName, ['username', '_id']);
            if (userNameCheck && userNameCheck._id) {
                return Constant.STATUS_MSG.ERROR.E400.USER_NAME_ALREDY_TAKEN;
            }
            else {
                let UserCheck = await ENTITY.UserE.getOneEntity(checkMail, ['email', '_id']);
                if (UserCheck && UserCheck._id) {
                    return Constant.STATUS_MSG.ERROR.E400.EMAIL_ALREADY_TAKEN;
                }
                else {
                    let makePassword = await utils.cryptData(payload.password);
                    let userData = {
                        userName: payload.userName.trim().toLowerCase(),
                        email: payload.email.trim().toLowerCase(),
                        password: makePassword,
                        isEmailVerified: true,
                        isProfileComplete: false
                    };
                    let User = await ENTITY.UserE.createOneEntity(userData);
                    let userResponse = UniversalFunctions.formatUserData(User);
                    return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
                }
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async login(payload) {
        try {
            let unique = payload.email;
            let checkEmailOrUserName = (unique) => {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(unique).toLowerCase());
            };
            if (checkEmailOrUserName(unique) === true)
                unique = unique.trim().toLowerCase();
            let checkData = { $or: [{ email: unique }, { userName: payload.email.trim().toLowerCase() }] };
            let userData = await ENTITY.UserE.getOneEntity(checkData, {});
            if (userData && userData._id) {
                if (userData.isEmailVerified) {
                    if (!(await utils.deCryptData(payload.password, userData.password))) {
                        return Constant.STATUS_MSG.ERROR.E400.INVALID_PASSWORD;
                    }
                    else {
                        let accessToken = await ENTITY.UserE.createToken(payload, userData);
                        await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
                        let formatedData = await utils.formatUserData(userData);
                        return { formatedData: formatedData, accessToken: accessToken };
                    }
                }
                else {
                    let accessToken = await ENTITY.UserE.createToken(payload, userData);
                    await ENTITY.SessionE.createSession(payload, userData, accessToken, 'user');
                    let formatedData = await utils.formatUserData(userData);
                    return { formatedData: formatedData, accessToken: accessToken };
                }
            }
            else {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_LOGIN;
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async portpertyDetail(payload) {
        try {
            let criteria = {
                _id: payload._id
            };
            if (payload._id.length < 24 && payload._id.length > 24) {
                return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;
            }
            let getDetail = await ENTITY.PropertyE.getOneEntity(criteria, {});
            if (!getDetail)
                return Constant.STATUS_MSG.ERROR.E400.PROPERTY_NOT_REGISTERED;
            return getDetail;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async updateProfile(payload) {
        try {
            let criteria = {
                _id: payload._id
            };
            let isProfileComplete;
            if (payload.firstName && payload.lastName && payload.type) {
                payload.isProfileComplete = true;
            }
            else
                isProfileComplete = false;
            let updateUser = await ENTITY.UserE.updateOneEntity(criteria, payload);
            return updateUser;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async forgetPassword(payload) {
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
                let url = config.get("host") + "/v1/user/verifyLink/" + passwordResetToken;
                let mail = new mail_manager_1.MailManager(payload.email, "forGet password", url);
                mail.sendMail();
                return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async changePassword(payload, userData) {
        try {
            let criteria = {
                _id: userData._id
            };
            let password = await ENTITY.UserE.getOneEntity(criteria, ['password']);
            if (!(await utils.deCryptData(payload.oldPassword, password.password)))
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_CURRENT_PASSWORD);
            else {
                let updatePswd = {
                    password: await utils.cryptData(payload.newPassword),
                    updatedAt: new Date().getTime()
                };
                let updatePassword = await ENTITY.UserE.updateOneEntity(criteria, updatePswd);
                if (!updatePassword)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else
                    return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async verifyLink(payload) {
        try {
            let result = await Jwt.verify(payload.link, cert, { algorithms: ['HS256'] });
            let userData = await ENTITY.UserE.getOneEntity(result.email, {});
            if (!userData)
                return Constant.STATUS_MSG.ERROR.E500.IMP_ERROR;
            else {
                let criteria = { email: result };
                let userAttribute = ['passwordResetTokenExpirationTime', 'passwordResetToken'];
                let userExirationTime = await ENTITY.UserE.getOneEntity(criteria, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
                let today = new Date();
                let diffMs = (today - userExirationTime.passwordResetTokenExpirationTime);
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if (diffMins > 0)
                    return Promise.reject('LinkExpired');
                else
                    return {};
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async verifyLinkForResetPwd(payload) {
        try {
            let result = await Jwt.verify(payload['link'], cert, { algorithms: ['HS256'], });
            if (!result)
                return Promise.reject();
            let checkAlreadyUsedToken = await ENTITY.UserE.getOneEntity({ email: result }, ['passwordResetTokenExpirationTime', 'passwordResetToken']);
            if (checkAlreadyUsedToken.passwordResetTokenExpirationTime == null && !checkAlreadyUsedToken.passwordResetToken == null)
                return Promise.reject("Already_Changed");
            let updatePswd = {
                password: await utils.cryptData(payload.password),
                updatedAt: new Date().getTime(),
                passwordResetTokenExpirationTime: null,
                passwordResetToken: null
            };
            let today = new Date();
            let diffMs = (today - checkAlreadyUsedToken.passwordResetTokenExpirationTime);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (diffMins > 0)
                return Promise.reject("Time_Expired");
            else {
                let updatePassword = await ENTITY.UserE.updateOneEntity({ email: result }, updatePswd);
                if (!updatePassword)
                    return Promise.reject(Constant.STATUS_MSG.ERROR.E500.IMP_ERROR);
                else
                    return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT;
            }
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async dashboard(userData) {
        try {
            let query;
            let pipeline = [
                {
                    "$facet": {
                        "Active": [
                            {
                                "$match": {
                                    $and: [{ "Property_status.number": Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER }, { "userId": userData._id }]
                                }
                            },
                            { "$count": "Total" }
                        ],
                        "Featured": [
                            { "$match": { $and: [{ "isFeatured": true }, { "userId": userData._id },] } },
                            { "$count": "Total" },
                        ],
                        "soldPropertyLast30Days": [
                            {
                                "$match": {
                                    $and: [{ "Property_status": Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED }, { "property_basic_details.property_for_number": Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER }, { "userId": userData._id },
                                        { "property_sold_time": { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } }
                                    ]
                                }
                            },
                            { "$count": "Total" },
                        ],
                        "rentedPropertyLast30Days": [
                            {
                                "$match": {
                                    $and: [{ "Property_status": Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED }, { "property_basic_details.property_for_number": Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER }, { "userId": userData._id },
                                        { "property_rent_time": { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } }
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
            ];
            let data = await ENTITY.UserE.aggregate(pipeline);
            return Object.assign({}, data[0], { isFeaturedProfile: !!userData.isFeaturedProfile });
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
exports.UserController = UserController;
exports.UserService = new UserController();
//# sourceMappingURL=user.controller.js.map
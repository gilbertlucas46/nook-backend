
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
            let getDetail = await ENTITY.PropertyE.getOneEntity(criteria, {});
            if (!getDetail || getDetail == null) {
                return Constant.STATUS_MSG.ERROR.E400.CUSTOM_DEFAULT
            }
            return getDetail;

        } catch (error) {
            return Promise.reject(error)
        }
    }

    async updateProfile(payload: UserRequest.ProfileUpdate, userData) {
        try {
            console.log('userDatauserData', userData);

            let criteria = {
                _id: userData._id
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
}

export let UserService = new UserController();

'use strict';
import { BaseEntity } from './base.entity'
import * as config from 'config'
import * as moment from "moment";
import * as UniversalFunctions from './../utils'
// import { TokenManager } from './../Lib';
import * as CONSTANT from '../constants/app.constant'
import * as TokenManager from '../lib'
export class UserClass extends BaseEntity {
    constructor() {
        super('User')
    }

    async createMerchant(userData: UserRequest.Register) {
        try {
            let dataToInsert = {
                name: userData.userName,
                email: userData.email,
                // password:userData.password ,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
            }
            let user: UserRequest.Register = await this.createOneEntity(dataToInsert)
            return user
        } catch (error) {
            console.error('User Entity createUser', error)
            return Promise.reject(error)
        }
    }

    async createToken(payload, userData: UserRequest.userData) {
        try {
            let sessionValid = {};
            if (userData.session) {
                sessionValid = {
                    session: userData.session
                }
            }
            let tokenData = {
                id: userData._id,
                deviceId: payload.deviceId,
                deviceToken: payload.deviceToken,
                tokenType: userData.type,
                timestamp: new Date().getTime(),
                session: userData.session
            }
            let mergeData = { ...tokenData, ...sessionValid }
            let accessToken: any = await TokenManager.setToken(mergeData);

            return accessToken["accessToken"];

        } catch (error) {
            return Promise.reject(error)
        }
    }
}


export const UserE = new UserClass()

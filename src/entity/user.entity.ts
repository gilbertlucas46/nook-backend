'use strict';
import { BaseEntity } from './base.entity'
import * as config from 'config'
import * as TokenManager from '../lib'
import * as Jwt from 'jsonwebtoken'
const cert = config.get('jwtSecret')

export class UserClass extends BaseEntity {
    constructor() {
        super('User')
    }

    async createUser(userData: UserRequest.userData) {
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
            let tokenData;
            // if (!userData.type) {
            //     tokenData = {
            //         id: userData._id,
            //         deviceId: payload.deviceId,
            //         deviceToken: payload.deviceToken,
            //         tokenType: "TENANT",
            //         timestamp: new Date().getTime(),
            //         session: userData.session
            //     }
            // } else {
            tokenData = {
                id: userData._id,
                deviceId: payload.deviceId,
                deviceToken: payload.deviceToken,
                tokenType: userData.type,
                timestamp: new Date().getTime(),
                session: userData.session
            }
            // }

            let mergeData = { ...tokenData, ...sessionValid }
            let accessToken: any = await TokenManager.setToken(mergeData);
            return accessToken["accessToken"];

        } catch (error) {
            return Promise.reject(error)
        }
    }
    async createPasswordResetToken(userData) {
        try {
            let tokenToSend = await Jwt.sign(userData.email, cert, { algorithm: 'HS256' });
            let expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);

            let criteriaForUpdatePswd = { _id: userData._id }
            let dataToUpdateForPswd = {
                passwordResetToken: tokenToSend,
                passwordResetTokenExpirationTime: expirationTime
            };
            await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
            return tokenToSend;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async getData(criteria, ProjectData) {
        try {
            let data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData)
            return data
        } catch (error) {
            Promise.reject(error)
        }
    }
}


export const UserE = new UserClass()

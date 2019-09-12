'use strict';
import { BaseEntity } from '../base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert = config.get('jwtSecret');
import * as utils from '../../utils'

export class AdminClass extends BaseEntity {
    constructor() {
        super('Admin')
    }

    async createAdmin(adminData: AdminRequest.adminData) {
        try {
            let dataToInsert = {
                email: adminData.email,
                // password:userData.password ,
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                phoneNumber: adminData.phoneNumber,
            }
            let admin: UserRequest.Register = await this.createOneEntity(dataToInsert)
            return admin;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async adminAccountCreator() {
        let to_save = {
            name: 'Base Admin',
            email: 'base_admin@yopmail.com',
            password: await utils.cryptData('123456')
        }
        let criteria = {
            email: 'base_admin@yopmail.com'
        }
        let theData = await this.getOneEntity(criteria, {});
        if (!theData) await this.createOneEntity(to_save);
        return '__ADMIN ACCOUNT LOOKUP/CREATION DONE__'
    }


    async createToken(adminData: AdminRequest.TokenPayload) {
        try {
            const accessToken = Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), _id: adminData.adminId }, cert);
            return accessToken;
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async createPasswordResetToken(adminData) {
        try {
            let tokenToSend = await Jwt.sign(adminData.email, cert, { algorithm: 'HS256' });
            let expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
            let criteriaForUpdatePswd = { _id: adminData._id };

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
            let data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
            return data;
        } catch (error) {
            Promise.reject(error);
        }
    }
}

export const AdminE = new AdminClass()

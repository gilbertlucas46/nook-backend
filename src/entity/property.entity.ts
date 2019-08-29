'use strict';
import { BaseEntity } from './base.entity'
import * as CONSTANT from '../constants/app.constant'
import * as TokenManager from '../lib'

export class PropertyClass extends BaseEntity {
    constructor() {
        super('Property')
    }

    async createProperty(userData: UserRequest.Register) {
        try {
            // let dataToInsert = {
            //     name: userData.userName,
            //     email: userData.email,
            //     // password:userData.password ,
            //     firstName: userData.firstName,
            //     lastName: userData.lastName,
            //     phoneNumber: userData.phoneNumber,
            // }
            // let user: UserRequest.Register = await this.createOneEntity(dataToInsert)
            // return user
        } catch (error) {
            console.error('User Entity createUser', error)
            return Promise.reject(error)
        }
    }

}


export const PropertyE = new PropertyClass()

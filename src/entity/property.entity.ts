'use strict';
import { BaseEntity } from './base.entity'
import * as CONSTANT from '../constants/app.constant'
import * as TokenManager from '../lib'
import * as utils from '../utils'
export class PropertyClass extends BaseEntity {
    constructor() {
        super('Property')
    }

    async createProperty(userData: UserRequest.Register) {
        try {
        } catch (error) {
            console.error('User Entity createUser', error)
            return Promise.reject(error)
        }
    }
    async PropertyList(pipeLine) {
        try {
            console.log("pipeline -----------------", pipeLine);
            console.log("---------------------", this.modelName)
            let propertyData = await utils.paginate(this.modelName, pipeLine, 1, 1);
            console.log('propertyData', propertyData);

            return propertyData;
        } catch (error) {
            return Promise.reject(error)
        }
    }
}


export const PropertyE = new PropertyClass()

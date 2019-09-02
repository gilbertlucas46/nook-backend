'use strict';
import { BaseEntity } from './base.entity'
import * as CONSTANT from '../constants/app.constant'
import * as TokenManager from '../lib'
import * as utils from '../utils'
export class PropertyClass extends BaseEntity {
    constructor() {
        super('Property')
    }
    async PropertyList(pipeline) {
        try {
            let propertyList = await this.DAOManager.paginate(this.modelName, pipeline)
            return propertyList
        } catch (error) {
            return Promise.reject(error)
        }
    }
}


export const PropertyE = new PropertyClass()

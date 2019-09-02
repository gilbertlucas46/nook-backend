'use strict';
import { BaseEntity } from './base.entity'
import * as CONSTANT from '../constants/app.constant'
import * as TokenManager from '../lib'

export class PropertyClass extends BaseEntity {
    constructor() {
        super('Property')
    }
}


export const PropertyE = new PropertyClass()

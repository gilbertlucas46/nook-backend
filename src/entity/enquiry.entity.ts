'use strict';
import { BaseEntity } from './base.entity'

export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry')
    }

    async enquiryList(pipeline) {
        try {
            let enquiryList = await this.DAOManager.paginate(this.modelName, pipeline);
            console.log('enquiryList>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', enquiryList);

            return enquiryList
        } catch (error) {
            return Promise.reject(error)
        }
    }

}

export const EnquiryE = new EnquiryClass()

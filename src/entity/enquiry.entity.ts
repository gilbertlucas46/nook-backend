'use strict';
import { BaseEntity } from './base.entity';

export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry');
    }

    async enquiryList(pipeline) {
        try {
            const enquiryList = await this.DAOManager.paginate(this.modelName, pipeline);
            return enquiryList;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async enquiryList1(pipeline) {
        try {
            const propertyData = await EnquiryE.paginate(this.modelName, pipeline);
            console.log('propertyData', propertyData);
            return propertyData;

        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export const EnquiryE = new EnquiryClass();

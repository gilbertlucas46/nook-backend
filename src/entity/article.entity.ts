'use strict';
import { BaseEntity } from './base.entity';
import { EnquiryRequest } from '../interfaces/enquiry.interface';
import { UserRequest } from '../interfaces/user.interface';

export class ArticleClass extends BaseEntity {
    constructor() {
        super('Article');
    }

    async enquiryList(payload: EnquiryRequest.GetEnquiry, userData: UserRequest.UserData) {
        try {

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleE = new ArticleClass();

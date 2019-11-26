import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { MailManager } from '@src/lib/mail.manager';
import * as request from 'request';
import * as config from 'config';

/**
 * @author
 * @description This controller contains actions for related to enquiry on any property.
 */

export class EnquiryController {
    constructor() { }
    /**
     * @function createEnquiry
     * @description function to create enquiry regarding any property.
     * @payload  CreateEnquiry
     * return send mail and success
     */

    async createEnquiry(payload: EnquiryRequest.CreateEnquiry, userData?) {
        try {
            let dataToSave = {};
            let enquiryData = {};
            let html: any;
            let mail: any;
            // for the user=> agent
            if (payload.agentEmail) {
                dataToSave = {
                    email: payload.email,
                    userType: userData.type ? userData.type : '',
                    name: payload.name,
                    message: payload.message,
                    phoneNumber: payload.phoneNumber,
                    propertyId: payload.propertyId,
                    enquiryType: Constant.DATABASE.ENQUIRY_TYPE.CONTACT,
                    agentId: payload.agentId,
                };

                if (userData._id) dataToSave['userId'] = userData._id;
                html = `<p> This user want to contact to you | email: ${payload.email} |phoneNumber:${payload.phoneNumber}...</p>`;
                mail = new MailManager(payload.agentEmail, 'Enquiry', html);
                // mail.sendMail();
                enquiryData = ENTITY.EnquiryE.createOneEntity(dataToSave);
                return {};
            }

            dataToSave = {
                email: payload.email,
                userType: userData.type ? userData.type : '', // Constant.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
                name: payload.name,
                message: payload.message,
                phoneNumber: payload.phoneNumber,
                propertyId: payload.propertyId,
                propertyOwnerId: payload.propertyOwnerId,
                enquiryType: Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
            };

            if (userData._id) {
                dataToSave['userId'] = userData._id;
            }
            html = `<p> this user want an enquiry of your property | email: ${payload.email} |phoneNumber:${payload.phoneNumber} | propertyId:${payload.propertyId}    ...</p>`;
            mail = new MailManager(payload.propertyOwnerEmail, 'Enquiry', html);
            // mail.sendMail();
            await ENTITY.EnquiryE.createOneEntity(dataToSave);

            // send lead to salesforce
            const salesforceData = {
                email: payload.email,
                userType: userData.type ? userData.type : '',
                name: payload.name,
                message: payload.message,
                phoneNumber: payload.phoneNumber,
                propertyId: payload.propertyId,
                propertyOwnerId: payload.propertyOwnerId,
                enquiryType: Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
            };

            request.post({ url: config.get('zapier_enquiryUrl'), formData: salesforceData }, function optionalCallback(err, httpResponse, body) {
                if (err) { return console.log(err); }
                console.log('body ----', body);
            });
            return;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function getEnquiryList
     * @description Get list of all enquiry for particular user.
     * @payload  GetEnquiry and userData
     * return []
     */

    async getEnquiryList(payload: EnquiryRequest.GetEnquiry, userData) {
        try {
            return await ENTITY.EnquiryE.enquiryList(payload, userData);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function getEnquiryById
     * @description Get enquiry details.
     * @payload  GetInquiryById
     * return {}
     */
    async getEnquiryById(payload: EnquiryRequest.GetInquiryById) {
        try {
            const criteria = { _id: payload.enquiryId };
            return await ENTITY.EnquiryE.getOneEntity(criteria, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let EnquiryService = new EnquiryController();

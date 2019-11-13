import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { MailManager } from '@src/lib/mail.manager';

/**
 * @author
 * @description This controller contains actions for related to enquiry on any property.
 */

export class EnquiryController {
    constructor() { }
    /**
     * @description A function to create enquiry regarding any property.
     * @param payload
     */
    async createEnquiry(payload: EnquiryRequest.CreateEnquiry, userData?) {
        try {
            let dataToSave;
            let enquiryData = {};
            let html: any;
            let mail: any;
            // foe the user=> agent
            if (payload.agentEmail) {
                dataToSave = {
                    email: payload.email,
                    userType: userData.type ? userData.type : '',
                    name: payload.name,
                    message: payload.message,
                    phoneNumber: payload.phoneNumber,
                    propertyId: payload.propertyId,
                    // enquiryFor:'Agent'
                    // propertyOwnerId: payload.propertyOwnerId,
                    enquiryType: Constant.DATABASE.ENQUIRY_TYPE.CONTACT,
                    agentId: payload.agentId,
                };
                if (userData._id) {
                    dataToSave['userId'] = userData._id;
                }
                html = `<p> this user want to contact to you | email: ${payload.email} |phoneNumber:${payload.phoneNumber}...</p>`;
                mail = new MailManager(payload.agentEmail, 'Enquiry', html);
                // mail.sendMail();
                enquiryData = ENTITY.EnquiryE.createOneEntity(dataToSave);
                return {};
            }
            // const propertyOwner = { _id: payload.propertyId };
            // const propertyOnwerId = await ENTITY.PropertyE.getOneEntity(propertyOwner, ['property_added_by.userId', '_id']);
            dataToSave = {
                email: payload.email,
                userType: userData.type ? userData.type : '', // Constant.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
                name: payload.name,
                message: payload.message,
                phoneNumber: payload.phoneNumber,
                propertyId: payload.propertyId,
                // userId: userData._id ? userData._id : '',
                // propertyOwnerId: propertyOnwerId.property_added_by.userId,
                propertyOwnerId: payload.propertyOwnerId,
                enquiryType: Constant.DATABASE.ENQUIRY_TYPE.PROPERTY,
                // tytle: payload.title,
            };
            if (userData._id) {
                dataToSave['userId'] = userData._id;
            }
            html = `<p> this user want an enquiry of your property | email: ${payload.email} |phoneNumber:${payload.phoneNumber} | propertyId:${payload.propertyId}    ...</p>`;
            mail = new MailManager(payload.propertyOwnerEmail, 'Enquiry', html);
            // mail.sendMail();
            enquiryData = await ENTITY.EnquiryE.createOneEntity(dataToSave);
            return enquiryData;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @description Get list of all enquiry for particular user.
     * @param payload
     * @param userData
     */
    async getEnquiryList(payload: EnquiryRequest.GetEnquiry, userData) {
        try {
            const propertyData = await ENTITY.EnquiryE.enquiryList(payload, userData);
            return propertyData;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @description A function to get details of particular enquiry based on the Id
     * @param payload
     */

    async getEnquiryById(payload: EnquiryRequest.GetInquiryById) {
        try {
            const criteria = { _id: payload.enquiryId };
            const getData = await ENTITY.EnquiryE.getOneEntity(criteria, {});
            return getData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let EnquiryService = new EnquiryController();

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
            // let mail: any;
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
                const getName = await ENTITY.UserE.getOneEntity({ email: payload.agentEmail }, { userName: 1, firstName: 1 });

                if (userData._id) dataToSave['userId'] = userData._id;
                // get the email of the property owner by propertyId
                enquiryData = ENTITY.EnquiryE.createOneEntity(dataToSave);
                const mail = new MailManager();
                const sendObj = {
                    userName: getName.userName,
                    firstName: getName.firstName,
                    receiverEmail: payload.agentEmail, // propertyData['property_added_by']['email'],
                    subject: Constant.EMAIL_TEMPLATE.SUBJECT.Contact,
                    name: payload.name,
                    message: payload.message,
                    phone: payload.phoneNumber,
                    email: payload.email,
                };
                mail.contactEmail(sendObj);
                // return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, userResponse);
                return {};
            }
            else {
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
                // html = `<p> this user want an enquiry of your property | email: ${payload.email} |phoneNumber:${payload.phoneNumber} | propertyId:${payload.propertyId}    ...</p>`;
                // mail = new MailManager(payload.propertyOwnerEmail, 'Enquiry', html);
                // mail.sendMail();
                await ENTITY.EnquiryE.createOneEntity(dataToSave);
                const criteria = {
                    _id: payload.propertyId,
                };
                const propertyData = await ENTITY.PropertyE.getOneEntity(criteria, { 'property_added_by.userId': 1, 'property_added_by.email': 1, 'propertyId': 1, 'property_basic_details.title': 1, 'property_basic_details.name': 1 });
                console.log('propertyDatapropertyDatapropertyDatapropertyData', propertyData);

                const mail = new MailManager();
                const sendObj = {
                    receiverEmail: propertyData['property_added_by']['email'],
                    subject: Constant.EMAIL_TEMPLATE.SUBJECT.Enquiry,
                    propertyId: propertyData.propertyId,
                    name: payload.name || '',
                    message: payload.message,
                    title: propertyData['property_basic_details']['title'],
                    email: payload.email || '',
                    phone: payload.phoneNumber || '',
                    propertyUrl: config.get('homePage') + '/property/' + propertyData.property_basic_details.name,
                };
                mail.enquiryEmail(sendObj);

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
            }
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

    async adminGetEnquiryList(payload) {
        try {
            const data = await ENTITY.EnquiryE.adminEnquiryList(payload);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let EnquiryService = new EnquiryController();

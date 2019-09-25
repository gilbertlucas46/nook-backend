import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';

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
    async createEnquiry(payload: EnquiryRequest.CreateEnquiry) {
        try {
            const propertyOwner = { _id: payload.propertyId };
            const propertyOnwerId = await ENTITY.PropertyE.getOneEntity(propertyOwner, ['property_added_by.userId', '_id']);

            const dataToSave = {
                email: payload.email,
                userType: Constant.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
                name: payload.name,
                message: payload.message,
                phoneNumber: payload.phoneNumber,
                propertyId: payload.propertyId,
                propertyOwnerId: propertyOnwerId.property_added_by.userId,
            };

            const enquiryData = await ENTITY.EnquiryE.createOneEntity(dataToSave);
            return enquiryData;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @description Function to post enquiry regarding any property after login.
     * @param payload
     */

    async createAuthEnquiry(payload: EnquiryRequest.CreateEnquiry) {
        try {
            const propertyOwner = { _id: payload.propertyId };
            const propertyOnwerId = await ENTITY.PropertyE.getOneEntity(propertyOwner, ['property_added_by.userId', '_id']);
            const dataToSave = {
                email: payload.email,
                userType: Constant.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER,
                name: payload.name,
                message: payload.message,
                phoneNumber: payload.phoneNumber,
                propertyId: payload.propertyId,
                propertyOwnerId: propertyOnwerId.property_added_by.userId,
            };
            const enquiryData = await ENTITY.EnquiryE.createOneEntity(dataToSave);
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
            const criteria = {
                _id: payload.enquiryId,
            };
            const getData = await ENTITY.EnquiryE.getOneEntity(criteria, {});
            return getData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let EnquiryService = new EnquiryController();

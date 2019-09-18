import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class EnquiryController {
    constructor() { }
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

    async getEnquiryList(payload: EnquiryRequest.GetEnquiry, userData) {
        try {
            let sortType;
            sortType = !sortType ? -1 : 1;
            const sortingType = {
                createdAt: sortType,
            };
            const { fromDate, toDate } = payload;
            let createdAt;
            let query: any = {};
            query = { propertyOwnerId: userData._id };
            if (fromDate && toDate) {
                createdAt = {
                    $gte: fromDate,
                    $lte: toDate,
                };
                query = {
                    propertyOwnerId: userData._id,
                    createdAt,
                };
            }
            else if (toDate) {
                createdAt = {
                    $lte: new Date().getTime(),
                };
                query = {
                    propertyOwnerId: userData._id,
                    createdAt,
                };
            } else if (fromDate) {
                createdAt = {
                    $gte: new Date().getTime(),
                };
                query = {
                    propertyOwnerId: userData._id,
                    createdAt,
                };
            }

            const pipeLine = [
                {
                    $match: query,
                    //     propertyOwnerId: userData._id,
                    //     createdAt,
                    // },
                },
                {
                    $lookup: {
                        from: 'properties',
                        let: { pid: '$propertyId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$pid'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    property_basic_details: 1,
                                    propertyId: 1,
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'propertyData',
                    },
                },
                {
                    $unwind: {
                        path: '$propertyData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        updatedAt: 1,
                        createdAt: 1,
                        enquiry_status: 1,
                        userId: 1,
                        propertyId: '$propertyData.propertyId',
                        propertyOwnerId: 1,
                        userType: 1,
                        name: 1,
                        email: 1,
                        phoneNumber: 1,
                        message: 1,
                        title: '$propertyData.property_basic_details.title',
                    },
                },
                { $sort: sortingType },
            ];

            const propertyData = await ENTITY.EnquiryE.enquiryList(pipeLine);
            return propertyData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

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

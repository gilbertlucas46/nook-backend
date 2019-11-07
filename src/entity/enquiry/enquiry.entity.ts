'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';

export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry');
    }// EnquiryRequest.GetEnquiry,
    async enquiryList(payload: any, userData: UserRequest.UserData) {
        try {
            const { fromDate, toDate, category, enquiryType } = payload;
            let { sortType, limit, page } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            sortType = !sortType ? -1 : sortType;
            sortType = !sortType ? -1 : 1;
            const sortingType = {
                createdAt: sortType,
            };
            const query: any = {};
            if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.ENQUIRY && category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                query['userId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.ENQUIRY;
            }

            if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.ENQUIRY && category === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                query['propertyOwnerId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.ENQUIRY;
            }
            if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && payload.category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                // query
                query['userId'] = userData._id;
                query['enquiryType'] = payload.enquiryType;
            }

            if (userData.type && payload.category === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && enquiryType === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                query['userId'] = userData._id;
                query['enquiryType'] = payload.enquiryType;
            }

            if (fromDate && toDate) {
                query['createdAt'] = {
                    $gte: fromDate,
                    $lte: toDate,
                };
            } else if (toDate) {
                query['createdAt'] = {
                    $lte: toDate,
                };
            } else if (fromDate) {
                query['createdAt'] = {
                    $gte: fromDate,
                    $lte: new Date().getTime(),
                };
            }

            const pipeLine = [
                {
                    $match: query,
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
                        property_id: '$propertyData._id',
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

            const enquiryList = await this.DAOManager.paginate(this.modelName, pipeLine, limit, page);
            return enquiryList;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const EnquiryE = new EnquiryClass();

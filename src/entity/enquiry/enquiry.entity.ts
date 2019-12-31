'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry');
    }
    async enquiryList(payload: EnquiryRequest.GetEnquiry, userData: UserRequest.UserData) {
        try {
            console.log('userDatauserDatauserData', userData);

            const { fromDate, toDate, category, enquiryType, searchTerm, limit } = payload;
            let { sortType, page } = payload;
            sortType = !sortType ? -1 : sortType;
            if (!page) { page = 1; }
            const paginateOptions = {
                page: page || 1,
                limit: limit || Constant.SERVER.LIMIT,
            };
            const sortingType = {
                createdAt: sortType,
            };
            let query: any = {};
            if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.PROPERTY && category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) {
                query['userId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.PROPERTY && category === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) {
                query['propertyOwnerId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) {
                query['userId'] = userData._id;
                query['enquiryType'] = payload.enquiryType;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && category === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) {
                query['agentId'] = userData._id;
                query['enquiryType'] = payload.enquiryType;
            }
            else if (userData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE || userData.type === Constant.DATABASE.USER_TYPE.ADMIN.TYPE) {
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            }
            else {
                console.log('else condition');
                query['userId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            }
            if (searchTerm) {
                query = {
                    userId: userData._id,
                    $or: [
                        { phoneNumber: { $regex: searchTerm, $options: 'i' } },
                        { email: { $regex: searchTerm, $options: 'i' } },
                        { name: { $regex: searchTerm, $options: 'i' } },
                    ],
                };
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

            const matchPipeline = [
                { $match: query },
                { $sort: sortingType },
            ];

            const pipeLine = [
                // {
                //     $match: query,
                // },
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
                        propertyName: '$propertyData.property_basic_details.name',
                    },
                },
            ];
            return await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, pipeLine).aggregate(this.modelName);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export const EnquiryE = new EnquiryClass();

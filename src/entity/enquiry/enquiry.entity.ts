'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';

export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry');
    }// EnquiryRequest.GetEnquiry,
    async enquiryList(payload: EnquiryRequest.GetEnquiry, userData: UserRequest.UserData) {
        try {
            console.log('payload', payload, payload.category);

            const { fromDate, toDate, category, enquiryType } = payload;
            let { sortType, limit, page } = payload;
            sortType = !sortType ? -1 : sortType;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            const sortingType = {
                createdAt: sortType,
            };
            const query: any = {};
            if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.PROPERTY && category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                console.log('11111111111111111111');
                query['userId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.PROPERTY && category === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                console.log('222222222222222222222222222');
                query['propertyOwnerId'] = userData._id;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && category === Constant.DATABASE.ENQUIRY_CATEGORY.SENT) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                console.log('3333333333333333333333333');
                // query
                query['userId'] = userData._id;
                query['enquiryType'] = payload.enquiryType;
            } else if (userData.type && enquiryType === Constant.DATABASE.ENQUIRY_TYPE.CONTACT && category === Constant.DATABASE.ENQUIRY_CATEGORY.RECEIVED) { // === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
                console.log('44444444444444444444444444444444');
                // query['userId'] = userData._id;
                query['agentId'] = userData._id; // payload.agentId;
                query['enquiryType'] = payload.enquiryType;
            } else {
                query['userId'] = userData._id; // payload.agentId;
                query['enquiryType'] = Constant.DATABASE.ENQUIRY_TYPE.PROPERTY;
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
            console.log('query>>>>>>>>>>>>>>>>>>>>>', query);
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
            // const promiseArray = [];
            // promiseArray.push(this.DAOManager.findAll(this.modelName, query, {}, { limit, skip, sort: sortingType }));
            // promiseArray.push(this.DAOManager.count(this.modelName, query));

            // const [data, total] = await Promise.all(promiseArray);
            const enquiryList = await this.DAOManager.paginate(this.modelName, pipeLine, limit, page);
            // return {
            //     data,
            //     total,
            // };
            return enquiryList;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const EnquiryE = new EnquiryClass();

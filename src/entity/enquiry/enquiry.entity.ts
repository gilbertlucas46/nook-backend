'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';

export class EnquiryClass extends BaseEntity {
    constructor() {
        super('Enquiry');
    }
    async enquiryList(payload: EnquiryRequest.GetEnquiry, userData: UserRequest.UserData) {
        try {
            const { fromDate, toDate } = payload;
            let { sortType, limit, page } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
            sortType = !sortType ? -1 : sortType;
            sortType = !sortType ? -1 : 1;
            const sortingType = {
                createdAt: sortType,
            };
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

    async enquiryList1(pipeline) {
        try {
            const propertyData = await EnquiryE.paginate(this.modelName, pipeline);
            return propertyData;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const EnquiryE = new EnquiryClass();

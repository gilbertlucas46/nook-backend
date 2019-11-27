import { BaseEntity } from '@src/entity/base/base.entity';
import { AgentRequest } from '@src/interfaces/agent.interface';
import { SERVER } from '@src/constants/app.constant';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
export class AgentClass extends BaseEntity {
    constructor() {
        super('User');
    }

    async getAgent(payload: AgentRequest.SearchAgent) {
        try {
            let { page, limit, sortType, sortBy } = payload;
            const { cityId, specializingIn_property_type, searchBy, searchTerm, specializingIn_property_category, soldProperty } = payload;
            if (!limit) { limit = SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject: any = {};
            matchObject['type'] = 'AGENT';
            let searchCriteria: any;
            if (searchTerm) {
                if (searchBy === 'company') {
                    searchCriteria = {
                        $match:
                            { companyName: new RegExp('.*' + searchTerm + '.*', 'i') },
                    };
                }
                else if (searchBy === 'location') {
                    searchCriteria = {
                        $match:
                            { address: new RegExp('.*' + searchTerm + '.*', 'i') },
                    };
                } else if (searchBy === 'name') {
                    searchCriteria = {
                        $match:
                        {
                            $or: [
                                { firstName: new RegExp('.*' + searchTerm + '.*', 'i') },
                                { lastName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            ],
                        },
                    };
                }
            }
            else {
                searchCriteria = {
                    $match: {
                    },
                };
            }

            if (sortBy) {
                switch (sortBy) {
                    case 'date':
                        sortBy = 'date';
                        sortingType = {
                            createdAt: sortType,
                        };
                        break;
                    default:
                        // sortBy = 'isFeaturedProfile';
                        sortingType = {
                            isFeaturedProfile: sortType,
                        };
                        break;
                }
            } else {
                sortingType = {
                    isFeaturedProfile: sortType,
                };
            }
            if (specializingIn_property_type) {
                matchObject['specializingIn_property_type'] =
                    specializingIn_property_type;
            }

            if (specializingIn_property_category) {
                matchObject['specializingIn_property_category'] =
                    { $in: specializingIn_property_category };
            }

            if (cityId) { matchObject['_id'] = Types.ObjectId(cityId); }
            // // Date filters
            // if (fromDate && toDate) { matchObject.$match['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            // if (fromDate && !toDate) { matchObject.$match['createdAt'] = { $gte: fromDate }; }
            // if (!fromDate && toDate) { matchObject.$match['createdAt'] = { $lte: toDate }; }
            const query = [
                { $match: matchObject },
                searchCriteria,
                { $sort: sortingType },
                { $skip: skip },
                { $limit: limit },
                {
                    $unwind: {
                        path: '$serviceAreas',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'cities',
                        let: { cityId: '$serviceAreas' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$cityId'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    name: 1,
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'cityData',
                    },
                },
                {
                    $unwind: {
                        path: '$cityData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        firstName: { $first: '$firstName' },
                        userName: { $first: '$userName' },
                        email: { $first: '$email' },
                        middleName: { $first: '$middleName' },
                        createdAt: { $first: '$createdAt' },
                        phoneNumber: { $first: '$phoneNumber' },
                        type: { $first: '$type' },
                        title: { $first: '$title' },
                        license: { $first: '$license' },
                        taxNumber: { $first: '$taxNumber' },
                        faxNumber: { $first: '$faxNumber' },
                        companyName: { $first: '$companyName' },
                        address: { $first: '$address' },
                        aboutMe: { $first: '$aboutMe' },
                        profilePicUrl: { $first: '$profilePicUrl' },
                        backGroundImageUrl: { $first: '$backGroundImageUrl' },
                        specializingIn_property_type: { $first: '$specializingIn_property_type' },
                        specializingIn_property_category: { $first: '$specializingIn_property_category' },
                        isFeaturedProfile: { $first: '$isFeaturedProfile' },
                        lastName: { $first: '$lastName' },
                        city: {
                            $push: {
                                cityId: '$cityData._id',
                                cityName: '$cityData.name',
                            },
                        },
                    },
                },
            ];
            return await this.DAOManager.paginate(this.modelName, query, limit, page);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async getAgentProperty(payload: AgentRequest.UserProperty) {
        try {
            let { sortType, sortBy, page, limit } = payload;
            const { propertyId } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const criteria = {
                _id: Types.ObjectId(propertyId),
            };

            const propertyData = await this.DAOManager.findOne(this.modelName, criteria, ['_id', 'property_added_by']);
            if (!propertyData) return Constant.STATUS_MSG.ERROR.E400.INVALID_ID;

            const query = {
                'property_added_by.userId': Types.ObjectId(propertyData.property_added_by.userId),
                'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
                'property_for.number': payload.propertyFor,
                '_id': {
                    $ne: Types.ObjectId(payload.propertyId),
                },
            };

            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        if (sortType === 1) {
                            sortingType = {
                                price: -1,
                            };
                        } else {
                            sortingType = {
                                isfeatured: 1,
                            };
                        }
                    default:
                        sortBy = 'isFeatured';
                        sortingType = {
                            isFeatured: 1,
                        };
                        break;
                }
            } else {
                sortingType = {
                    isFeatured: 1,
                };
            }
            const pipeline = [
                {
                    $match: query,
                },
                {
                    $project: {
                        property_features: 1,
                        updatedAt: 1,
                        createdAt: 1,
                        property_details: 1,
                        property_address: 1,
                        propertyId: '$_id',
                        propertyShortId: '$propertyId',
                        property_basic_details: 1,
                        property_added_by: 1,
                        propertyImages: 1,
                        isFeatured: 1,
                        property_status: 1,
                    },
                },
                { $sort: sortingType },
            ];
            return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getAgentInfo(userName: string) {
        try {
            const query = [
                {
                    $match: {
                        userName,
                    },
                },
                {
                    $unwind: {
                        path: '$serviceAreas',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'cities',
                        let: { cityId: '$serviceAreas' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$cityId'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    name: 1,
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'cityData',
                    },
                },
                {
                    $unwind: {
                        path: '$cityData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        firstName: { $first: '$firstName' },
                        userName: { $first: '$userName' },
                        email: { $first: '$email' },
                        middleName: { $first: '$middleName' },
                        createdAt: { $first: '$createdAt' },
                        phoneNumber: { $first: '$phoneNumber' },
                        type: { $first: '$type' },
                        title: { $first: '$title' },
                        license: { $first: '$license' },
                        taxNumber: { $first: '$taxNumber' },
                        faxNumber: { $first: '$faxNumber' },
                        companyName: { $first: '$companyName' },
                        address: { $first: '$address' },
                        aboutMe: { $first: '$aboutMe' },
                        profilePicUrl: { $first: '$profilePicUrl' },
                        backGroundImageUrl: { $first: '$backGroundImageUrl' },
                        specializingIn_property_type: { $first: '$specializingIn_property_type' },
                        specializingIn_property_category: { $first: '$specializingIn_property_category' },
                        isFeaturedProfile: { $first: '$isFeaturedProfile' },
                        lastName: { $first: '$lastName' },
                        city: {
                            $push: {
                                cityId: '$cityData._id',
                                cityName: '$cityData.name',
                            },
                        },
                    },
                },
            ];
            return await this.DAOManager.aggregateData(this.modelName, query);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export let AgentE = new AgentClass();
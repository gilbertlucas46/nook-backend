import { BaseEntity } from '@src/entity/base/base.entity';
import { AgentRequest } from '@src/interfaces/agent.interface';
import { SERVER } from '@src/constants/app.constant';
import { Types } from 'mongoose';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
export class AgentClass extends BaseEntity {
    constructor() {
        super('User');
    }

    async getAgent(payload: AgentRequest.SearchAgent) {
        try {
            let { page, limit, sortType, sortBy } = payload;
            const { fromDate, toDate, byCity, cityId, specializingIn_property_type, searchBy, searchTerm, specializingIn_property_category, soldProperty, screenType } = payload;
            const featuredType = (screenType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE) ? Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE : Constant.DATABASE.FEATURED_TYPE.PROFILE;
            if (!limit) { limit = SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            // const matchObject: any = {
            //     status: Constant.DATABASE.STATUS.USER.ACTIVE,
            // };
            // matchObject['type'] !=;
            let matchObject: any = {};
            matchObject['type'] = Constant.DATABASE.USER_TYPE.AGENT.TYPE;
            matchObject['status'] = Constant.DATABASE.STATUS.USER.ACTIVE;
            if (screenType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE) {
                matchObject['isHomePageFeatured'] = true;
                sortingType = {
                    createdAt: -1,
                };
            } else {
                sortingType = {
                    isHomePageFeatured: -1,
                    isFeaturedProfile: -1,
                    createdAt: -1,
                };
            }
            if (specializingIn_property_type) matchObject['specializingIn_property_type'] = specializingIn_property_type;
            if (specializingIn_property_category) matchObject['specializingIn_property_category'] = { $in: specializingIn_property_category };
            // if (cityId) { matchObject['_id'] = Types.ObjectId(cityId); }
            if (cityId) matchObject['serviceAreas'] = { $in: [new Types.ObjectId(cityId)] };

            // Date filters
            if (fromDate && toDate) { matchObject['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchObject['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchObject['createdAt'] = { $lte: toDate }; }
            const $or: object[] = [];
            const regExp = new RegExp(searchTerm, 'gi');
            if (searchTerm && searchBy !== 'location') {
                if (searchBy === 'company') {
                    $or.push({ companyName: regExp });
                } else if (searchBy === 'name') {
                    $or.push(
                        { userName: regExp },
                        { firstName: regExp },
                        { lastName: regExp },
                    );
                } else {
                    $or.push(
                        { email: regExp },
                        { userName: regExp },
                        { firstName: regExp },
                        { lastName: regExp },
                        { title: regExp },
                        { license: regExp },
                        { taxNumber: regExp },
                        { faxNumber: regExp },
                        { aboutMe: regExp },
                    );
                }
                matchObject = {
                    $and: [
                        matchObject,
                        { $or },
                    ],
                };
            }
            const lookupCities = {
                $lookup: {
                    from: 'cities',
                    let: { cityId: '$serviceAreas' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ['$_id', '$$cityId'],
                                },
                            },
                        },
                        {
                            $project: {
                                cityName: '$name',
                                cityId: '$_id',
                            },
                        },
                    ],
                    as: 'city',
                },
            };
            const query: object[] = [
                { $match: matchObject },
                {
                    $project: {
                        password: 0,
                        serviceAreas: 0,
                    },
                },
                // {
                //     $lookup: {
                //         from: 'subscriptions',
                //         let: { userId: '$_id' },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $and: [{ $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', featuredType] }],
                //                     },
                //                 },
                //             },
                //             { $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
                //             {
                //                 $project: {
                //                     _id: 1,
                //                 },
                //             },
                //         ],
                //         as: 'subscriptions',
                //     },
                // },
                // {
                //     $addFields: {
                //         isFeaturedProfile: {
                //             $cond: { if: { $eq: ['$subscriptions', []] }, then: false, else: true },
                //         },
                //     },
                // },
                // {
                //     $project: {
                //         subscriptions: 0,
                //     },
                // },
                { $sort: sortingType },
            ];
            if (searchBy !== 'location') {
                query.splice(1, 0, lookupCities);
                return await this.DAOManager.paginate(this.modelName, query, limit, page);
            }
            // matchObject['$expr'] = {
            //     $toBool: {
            //         $size: { $setIntersection: ['$serviceAreas', '$$cityId'] },
            //     },
            // };
            $or.push(
                { name: regExp },
            );
            matchObject = {
                // $and: [
                $or,
                // ],
            };

            const cityPipeline = [
                { $match: matchObject },
                {
                    $group:
                    {
                        _id: null,
                        cities: {
                            $push: '$_id',
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { cities: '$cities' },
                        pipeline: [{
                            $match: {
                                type: Constant.DATABASE.USER_TYPE.AGENT.TYPE,
                                $expr: {
                                    $toBool: {
                                        $size: { $setIntersection: ['$serviceAreas', '$$cities'] },
                                    },
                                },
                            },
                        },
                        ],
                        as: 'agents',
                    },
                },
                {
                    $unwind: {
                        path: '$agents',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $replaceRoot: { newRoot: '$agents' } },
                lookupCities,
            ];
            return await this.DAOManager.paginate('City', cityPipeline, limit, page);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
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
                        type: Constant.DATABASE.USER_TYPE.AGENT.TYPE,
                        status: Constant.DATABASE.STATUS.USER.ACTIVE,
                    },
                },
                // {
                //     $unwind: {
                //         path: '$serviceAreas',
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $lookup: {
                        from: 'cities',
                        let: {
                            cityId: '$serviceAreas',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$cityId'],
                                    },
                                },
                            }, {
                                $project: {
                                    cityId: '$_id',
                                    cityName: '$name',

                                },
                            },
                        ],
                        as: 'city',
                    },
                },
                {
                    $project: {
                        password: 0,
                        serviceAreas: 0,
                    },
                },

                // {
                //     $unwind: {
                //         path: '$cityData',
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                // {
                //     $group: {
                //         _id: '$_id',
                //         firstName: { $first: '$firstName' },
                //         userName: { $first: '$userName' },
                //         email: { $first: '$email' },
                //         middleName: { $first: '$middleName' },
                //         createdAt: { $first: '$createdAt' },
                //         phoneNumber: { $first: '$phoneNumber' },
                //         type: { $first: '$type' },
                //         title: { $first: '$title' },
                //         license: { $first: '$license' },
                //         taxNumber: { $first: '$taxNumber' },
                //         faxNumber: { $first: '$faxNumber' },
                //         companyName: { $first: '$companyName' },
                //         address: { $first: '$address' },
                //         fullPhoneNumber: { $first: '$fullPhoneNumber' },
                //         aboutMe: { $first: '$aboutMe' },
                //         profilePicUrl: { $first: '$profilePicUrl' },
                //         backGroundImageUrl: { $first: '$backGroundImageUrl' },
                //         specializingIn_property_type: { $first: '$specializingIn_property_type' },
                //         specializingIn_property_category: { $first: '$specializingIn_property_category' },
                //         isFeaturedProfile: { $first: '$isFeaturedProfile' },
                //         lastName: { $first: '$lastName' },
                //         isHomePageFeatured: { $first: '$isHomePageFeatured' },
                //         city: {
                //             $push: {
                //                 cityId: '$cityData._id',
                //                 cityName: '$cityData.name',
                //             },
                //         },
                //     },
                // },
                // {
                //     $lookup: {
                //         from: 'subscriptions',
                //         let: { userId: '$_id' },
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $and: [{ $eq: ['$userId', '$$userId'] }, { $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.PROFILE] }],
                //                     },
                //                 },
                //             },
                //             { $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
                //             {
                //                 $project: {
                //                     _id: 1,
                //                 },
                //             },
                //         ],
                //         as: 'subscriptions',
                //     },
                // },
                // {
                //     $addFields: {
                //         isFeaturedProfile: {
                //             $cond: { if: { $eq: ['$subscriptions', []] }, then: false, else: true },
                //         },
                //     },
                // },
                // {
                //     $project: {
                //         subscriptions: 0,
                //     },
                // },
            ];
            return await this.DAOManager.aggregateData(this.modelName, query);
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export let AgentE = new AgentClass();
import { BaseEntity } from '@src/entity/base/base.entity';
import { AgentRequest } from '@src/interfaces/agent.interface';
import { SERVER } from '@src/constants/app.constant';
import { Types } from 'mongoose';

export class AgentClass extends BaseEntity {
    constructor() {
        super('User');
    }

    async getAgent(payload: AgentRequest.SearchAgent) {
        try {
            let { page, limit, sortType, sortBy } = payload;
            const { fromDate, toDate, cityId, specializingIn_property_type, byCompanyName, searchTerm } = payload;
            if (!limit) { limit = SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
            const skip = (limit * (page - 1));
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let matchObject: any = { $match: { type: 'AGENT' } };
            let searchCriteria;

            if (searchTerm) {
                // for filtration
                searchCriteria = {
                    $match: {
                        $or: [
                            { companyName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            // { serviceAreas: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { firstName: new RegExp('.*' + searchTerm + '.*', 'i') },
                        ],
                    },
                };
            }
            else {
                searchCriteria = {
                    $match: {
                    },
                };
            }

            if (sortBy) {
                switch (sortBy) {
                    case 'name':
                        sortingType = {
                            userName: sortType,
                        };
                        break;
                    default:
                        sortBy = 'isFeaturedProfile',
                            sortingType = {
                                createdAt: sortType,
                            };
                        break;
                }
            } else {
                sortingType = {
                    isFeaturedProfile: sortType,
                };
            }

            if (specializingIn_property_type) {
                matchObject = {
                    $match: {
                        specializingIn_property_type: { $all: specializingIn_property_type },
                    },
                };
            }
            else if (byCompanyName) {
                matchObject = {
                    $match: {
                        companyName: byCompanyName,
                    },
                };
            }

            if (cityId) { matchObject.$match._id = Types.ObjectId(cityId); }
            // // Date filters
            // if (fromDate && toDate) { matchObject.$match['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            // if (fromDate && !toDate) { matchObject.$match['createdAt'] = { $gte: fromDate }; }
            // if (!fromDate && toDate) { matchObject.$match['createdAt'] = { $lte: toDate }; }

            const query = [
                matchObject,
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
                        city: {
                            $push: {
                                cityId: '$cityData._id',
                                cityName: '$cityData.name',
                            },
                        },
                    },
                },
            ];
            const agentList = await this.DAOManager.aggregateData(this.modelName, query);
            return agentList;

        } catch (err) {
            return Promise.reject(err);
        }
    }

}

export let AgentE = new AgentClass();
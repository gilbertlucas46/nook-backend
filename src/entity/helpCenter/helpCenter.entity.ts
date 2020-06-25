import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import { Types } from 'mongoose';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
export class HelpCenterEntity extends BaseEntity {
    constructor() {
        super('HelpCentre');
    }

    async getHelpCenterCategoryBygroup() {
        try {
            const pipeline: any[] = [
                {
                    $group: {
                        _id: '$categoryId',
                        category: {
                            $last: '$categoryType',
                        },
                        title: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                            },
                        },
                    },
                },
            ];
            return await this.DAOManager.aggregateData(this.modelName, pipeline, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getHelpCenterByCategory(payload) {
        try {
            const { searchTerm, id, type } = payload;
            let query;
            if (searchTerm) {
                query = {
                    // $and:{status:}
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { categoryType: { $regex: searchTerm, $options: 'i' } },
                    ],
                };
            }
            else {
                query = {

                };
            }
            // const d

            const pipeline: any[] = [
                {
                    $match: {
                        categoryId: id,
                        type,
                        $or: [
                            query,
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                    },
                },
            ];
            return await this.DAOManager.aggregateData(this.modelName, pipeline, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async adminGetHelpCenter(payload: helpCenterRequest.AdminGetHelpCnter) {
        try {
            const { categoryId, page, limit, searchTerm } = payload;
            let { sortType } = payload;
            const paginateOptions = {
                page: page || 1,
                limit: limit || 10,
            }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let searchCriteria = {};
            sortingType = {
                createdAt: sortType,
            };
            if (searchTerm) {
                // for filtration
                searchCriteria = {
                    $match: {
                        $or: [
                            { title: new RegExp('.*' + searchTerm + '.*', 'i') },
                        ],
                    },
                };
            } else {
                searchCriteria = {
                    $match: {
                    },
                };
            }
            const matchPipeline = [
                {
                    $match: {
                        categoryId: Types.ObjectId(categoryId),
                    },
                },
                searchCriteria,
                {
                    $sort: sortingType,
                },
            ];

            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
            console.log('dataaaaa', data);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let HelpCenterE = new HelpCenterEntity();
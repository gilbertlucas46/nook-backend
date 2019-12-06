'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
export class ArticleClass extends BaseEntity {
    constructor() {
        super('Article');
    }

    async allArticlesBasedOnCategory(payload: ArticleRequest.GetArticle) {
        try {
            let { page, limit } = payload;
            const { searchTerm } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const promise = [];
            let searchCriteria: any = {};
            if (searchTerm) {
                searchCriteria = {
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        // { title: new RegExp('.*' + searchTerm + '.*', 'i') },
                        // { description: new RegExp('.*' + searchTerm + '.*', 'i') },
                    ],
                };
            }
            else {
                searchCriteria = {
                };
            }
            const pipeline = [
                {
                    $match: searchCriteria,
                },
                {
                    $group: {
                        _id: null,
                        list: {
                            $push: '$$ROOT',
                        },
                    },
                },
                {
                    $project: {
                        results: {
                            $reduce: {
                                input: '$list',
                                initialValue: {
                                    FEATURED: [],
                                    LATEST: [],
                                    LIST: [],
                                },
                                in: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                {
                                                    $ne: [{ $size: '$$value.FEATURED' }, 1],
                                                },
                                                {
                                                    $eq: ['$$this.isFeatured', true],
                                                },
                                            ],
                                        },
                                        then: {
                                            $mergeObjects: ['$$value', { FEATURED: ['$$this'] }],
                                        },
                                        else: {
                                            $cond: {
                                                if: {
                                                    $ne: [{ $size: '$$value.LATEST' }, 3],
                                                },
                                                then: {
                                                    $mergeObjects: ['$$value', { LATEST: { $concatArrays: ['$$value.LATEST', ['$$this']] } }],
                                                },
                                                else: {
                                                    $mergeObjects: ['$$value', { LIST: { $concatArrays: ['$$value.LIST', ['$$this']] } }],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        LATEST: '$results.LATEST',
                        FEATURED: '$results.FEATURED',
                        LIST: '$results.LIST',
                    },
                },
                {
                    $lookup: {
                        from: 'articlecategories',
                        let: { list: '$LIST' },
                        as: 'CATEGORIES',
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    articles: {
                                        $filter: {
                                            input: '$$list',
                                            as: 'article',
                                            cond: {
                                                $eq: ['$_id', '$$article.categoryId'],
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    name: 1,
                                    articles: {
                                        $slice: ['$articles', 3],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        LIST: 0,
                    },
                },
            ];
            const data = await this.DAOManager.aggregateData(this.modelName, pipeline);
            if (!data) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            return data[0];
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getArticlelist(payload: ArticleRequest.GetArticle) {
        try {
            let { page, limit, sortType } = payload;
            const { articleId, sortBy, searchTerm, fromDate, toDate, categoryId } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let query: any = {};
            sortingType = {
                updatedAt: sortType,
            };

            if (categoryId) {
                query = {
                    categoryId,
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                    _id: {
                        $ne: {
                            articleId,
                        },
                    },
                };
            }
            else {
                query['status'] = {
                    $eq: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                };
            }
            if (fromDate && toDate) { query['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { query['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { query['createdAt'] = { $lte: toDate }; }

            const pipeline = [
                { $match: query },
                { $sort: sortingType },
            ];
            const data = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
            console.log('datadatadatadatadata', data);
            return data;
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserArticle(payload) {
        try {
            let { page, limit, searchTerm } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const promise = [];
            let searchCriteria: any = {};
            if (searchTerm) {
                searchCriteria = {
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        // { title: new RegExp('.*' + searchTerm + '.*', 'i') },
                        // { description: new RegExp('.*' + searchTerm + '.*', 'i') },
                    ],
                };
            }
            else {
                searchCriteria = {
                };
            }
            const pipeline = [

            ];

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleE = new ArticleClass();

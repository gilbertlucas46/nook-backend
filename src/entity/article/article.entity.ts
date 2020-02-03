'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
import { Types } from 'mongoose';
import * as UniversalFunctions from '../../utils';
export class ArticleClass extends BaseEntity {
    constructor() {
        super('Article');
    }

    async allArticlesBasedOnCategory(payload: ArticleRequest.GetArticle) {
        try {
            let { page, limit, sortType } = payload;
            const { searchTerm } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }

            sortType = !sortType ? -1 : sortType;
            let sortingType = {};

            sortingType = {
                createdAt: sortType,
                isFeatured: sortType,
            };

            let searchCriteria: any = {};
            if (searchTerm) {
                searchCriteria = {
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
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
                    $sort: sortingType,
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
                                $match: {
                                    status: Constant.DATABASE.ArticleCategoryStatus.ACTIVE,
                                },
                            },
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
                {
                    $unwind: {
                        path: '$FEATURED',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'articlecategories',
                        localField: 'FEATURED.categoryId',
                        foreignField: '_id',
                        as: 'FEATURED.category',
                    },
                },
                {
                    $unwind: {
                        path: '$FEATURED.category',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        FEATURED: {
                            $push: '$FEATURED',
                        },
                        LATEST: {
                            $first: '$LATEST',
                        },
                        CATEGORIES: {
                            $first: '$CATEGORIES',
                        },

                    },
                },
                {
                    $unwind: {
                        path: '$LATEST',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'articlecategories',
                        localField: 'LATEST.categoryId',
                        foreignField: '_id',
                        as: 'LATEST.category',
                    },
                },
                {
                    $unwind: {
                        path: '$LATEST.category',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        FEATURED: {
                            $first: '$FEATURED',
                        },
                        LATEST: {
                            $push: '$LATEST',
                        },
                        CATEGORIES: {
                            $first: '$CATEGORIES',
                        },

                    },
                },
            ];

            const data = await this.DAOManager.aggregateData(this.modelName, pipeline);
            // if (!data || data.length === 0) return UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S204.NO_CONTENT_AVAILABLE, data);
            return data[0] || {
                CATEGORIES: [],
                FEATURED: [],
                LATEST: [],
            };

        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getArticlelist(payload: ArticleRequest.GetArticle, Admindata) {
        try {
            let { sortType } = payload;
            const { articleId, searchTerm, fromDate, toDate, categoryId, status, page, limit } = payload;
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let query: any = {};
            sortingType = {
                isFeatured: sortType,
                updatedAt: sortType,
            };
            const paginateOptions = {
                page: page || 1,
                limit: limit || Constant.SERVER.LIMIT,
            };

            if (Admindata && !status) {
                query['$or'] = [
                    { status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE },
                    { status: Constant.DATABASE.ARTICLE_STATUS.BLOCK },
                ];
            } else if (status) {
                query = {
                    status,
                };
            } else if (articleId && categoryId) {
                query = {
                    categoryId: Types.ObjectId(categoryId),
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                    _id: {
                        $ne: Types.ObjectId(articleId),
                    },
                };
            }
            else {
                query = {
                    isFeatured: true,
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                };
            }

            if (searchTerm) {
                query = {
                    $or: [
                        { title: new RegExp('.*' + searchTerm + '.*', 'i') },
                        { description: new RegExp('.*' + searchTerm + '.*', 'i') },
                    ],
                };
            }
            if (fromDate && toDate) { query['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { query['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { query['createdAt'] = { $lte: toDate }; }

            const matchPipeline = [
                { $match: query },
                { $sort: sortingType },
            ];
            const pipeline = [
                {
                    $lookup: {
                        from: 'articlecategories',
                        let: { categoryId: '$categoryId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$categoryId'],
                                    },
                                },
                            },
                        ],
                        as: 'article',
                    },
                },
                {
                    $unwind: {
                        path: '$article',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        status: 1,
                        categoryName: '$article.name',
                        isFeatured: 1,
                        title: 1,
                        imageUrl: 1,
                        categoryType: 1,
                        categoryId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        addedBy: 1,

                    },
                },
            ];
            return await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, pipeline).aggregate(this.modelName);
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserArticle(payload) {
        try {
            const {
                type,
                searchTerm,
                categoryId,
                page = 1,
                sortType = -1,
                limit = Constant.SERVER.LIMIT,
            } = payload;
            const sortingType = { createdAt: sortType };

            if (type) {
                const criteria = {
                    categoryId: Types.ObjectId(Constant.SERVER.SELLING_ARTICLE_ID),
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                };
                return await this.DAOManager.findAll(this.modelName, criteria, {}, { limit: 3, skip: 0, sort: sortingType });
            }
            const paginateOptions = { page, limit, skip: null };
            if (page > 1) {
                paginateOptions.skip = (limit * (page - 1)) + 1;
            }
            let $match: object = {
                categoryId: Types.ObjectId(categoryId),
                status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
            };
            sortingType['isFeatured'] = sortType;
            if (searchTerm) {
                $match = {
                    $and: [
                        $match,
                        {
                            $or: [
                                { title: { $regex: searchTerm, $options: 'i' } },
                                { description: { $regex: searchTerm, $options: 'i' } },
                            ],
                        },
                    ],
                };
            }

            const matchPipeline = [
                { $match },
                { $sort: sortingType },
            ];
            const [metaData, data] = await Promise.all([
                page === 1 ? this.DAOManager.findOne('ArticleCategories', { _id: new Types.ObjectId(categoryId) }, {}) : null,
                this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName),
            ]);
            return {
                ...data,
                metaData,
            };

        } catch (error) {
            return Promise.reject(error);
        }
    }


    async getAdminArticle(payload: ArticleRequest.GetArticleById) {
        try {

            const matchPipeline = [
                {
                    $match: {
                        _id: new Types.ObjectId(payload.articleId),
                    },
                },
                {
                    $project: {
                        articleAction: 0,
                    },
                },
                {
                    $lookup: {
                        from: 'articlecategories',
                        let: { cid: '$categoryId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$cid'],
                                    },
                                },
                            },
                        ],
                        as: 'categoryData',
                    },
                },
                {
                    $addFields: {
                        categoryType: {
                            $let: {
                                vars: {
                                    category: { $arrayElemAt: ['$categoryData', 0] },
                                },
                                in: '$$category.name',
                            },
                        },
                    },
                },
                {
                    $project: {
                        categoryData: 0,
                    },
                },
            ];

            const data = await this.DAOManager.aggregateData(this.modelName, matchPipeline);
            return data[0];

        } catch (error) {
            return Promise.reject(error);
        }
    }

    // async sellingArticle() {
    //     try {
    //         const criteria = {
    //             categoryId: Types.ObjectId(Constant.SERVER.SELLING_ARTICLE_ID),
    //             status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
    //         };
    //         const sortingType = {
    //             createdAt: -1,
    //         }
    //         // promiseArray.push(this.DAOManager.findAll(this.modelName, query, {}, { limit, skip, sort: sortingType }));
    //         return await this.DAOManager.findAll(this.modelName, criteria, {}, { limit: 3, skip: 0, sort: sortingType });
    //     } catch (error) {

    //     }
    // }
}

export const ArticleE = new ArticleClass();

'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
import { Types, Schema } from 'mongoose';
import { ObjectId } from 'bson';
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
                updatedAt: sortType,
                isFeatured: sortType,
            };

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
                // {
                //     $project: {
                //     'articleAction': 0,
                //     },
                // },
            ];
            console.log('pipelinepipelinepipeline', JSON.stringify(pipeline));

            const data = await this.DAOManager.aggregateData(this.modelName, pipeline);
            if (!data) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            return data[0];
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getArticlelist(payload: ArticleRequest.GetArticle, Admindata) {
        try {
            console.log('userORAdmindatauserORAdmindatauserORAdmindata', Admindata);
            let { page, limit, sortType } = payload;
            const { articleId, sortBy, searchTerm, fromDate, toDate, categoryId, status } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let query: any = {};
            sortingType = {
                updatedAt: sortType,
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
            } else {
                query = {
                    categoryId: Types.ObjectId(categoryId),
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
                    _id: {
                        $ne: Types.ObjectId(articleId),
                    },
                };
            }

            // if (categoryId) {
            //     query = {
            //         categoryId: Types.ObjectId(categoryId),
            //         $and: [{
            //             $or: [{
            //                 status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
            //             }, {
            //                 status: Constant.DATABASE.ARTICLE_STATUS.BLOCK,
            //             }],
            //             _id: {
            //                 $ne: {
            //                     articleId: Types.ObjectId(articleId),
            //                 },
            //             },
            //         }],
            //     };
            // }

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

            const pipeline = [
                { $match: query },
                { $skip: skip },
                { $limit: limit },
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
                { $sort: sortingType },
            ];
            console.log('pipelinepipelinepipelinepipelinepipeline', pipeline);

            const data = await this.DAOManager.paginate(this.modelName, pipeline);
            return data;
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserArticle(payload) {
        try {
            let { sortType } = payload;
            const { categoryId, searchTerm } = payload;
            // if (!limit) { limit = Constant.SERVER.LIMIT; }
            // if (!page) { page = 1; }
            let sortingType = {};
            let query: any = {};
            let searchCriteria: any = {};
            sortType = !sortType ? -1 : sortType;
            sortingType = {
                isFeatured: sortType,
                updatedAt: sortType,
            };

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

            query = {
                categoryId: Types.ObjectId(categoryId),
                status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
            };

            const pipeline = [
                {
                    $match: query,
                },
                {
                    $match: searchCriteria,
                },
                { $sort: sortingType },
                { $limit: 7 },
                {
                    $project: {
                        articleAction: 0,
                    },
                },
            ];
            const cateogryPipeline = [
                {
                    $match: {
                        _id: new Types.ObjectId(categoryId),
                    },
                },
                {
                    $lookup: {
                        from: 'articles',
                        pipeline,
                        as: 'articles',
                    },
                },
            ];
            const data = await this.DAOManager.aggregateData('ArticleCategories', cateogryPipeline);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleE = new ArticleClass();

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
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }

            const pipeline = [
                {
                    $match: {
                        status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                    },
                },
                {
                    $project: {
                        title: 1,
                        categoryId: 1,
                        categoryType: 1,
                        description: 1,
                        viewCount: 1,
                        shareCount: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        imageUrl: 1,
                        isFeatured: 1,
                    },
                },
                {
                    $facet: {
                        FEATURED_ARTICLE: [
                            {
                                $match: {
                                    isFeatured: true,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: 1,
                            },
                        ],
                        RECENT: [
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: limit,
                            },
                        ],
                        AGENTS: [
                            {
                                $match: {
                                    categoryId: Constant.DATABASE.ARTICLE_TYPE.AGENTS.NUMBER,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: limit,
                            },
                        ],
                        BUYING: [
                            {
                                $match: {
                                    categoryId: Constant.DATABASE.ARTICLE_TYPE.BUYING.NUMBER,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: 3,
                            },
                        ],
                        HOME_LOANS: [
                            {
                                $match: {
                                    categoryId: Constant.DATABASE.ARTICLE_TYPE.HOME_LOANS.NUMBER,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: limit,
                            },
                        ],
                        RENTING: [
                            {
                                $match: {
                                    categoryId: Constant.DATABASE.ARTICLE_TYPE.RENTING.NUMBER,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: limit,
                            },
                        ],
                        SELLING: [
                            {
                                $match: {
                                    categoryId: Constant.DATABASE.ARTICLE_TYPE.SELLING.NUMBER,
                                },
                            },
                            {
                                $sort: {
                                    updatedAt: -1,
                                },
                            },
                            {
                                $limit: limit,
                            },
                        ],
                    },
                },
            ];

            const data = await this.DAOManager.aggregateData(this.modelName, pipeline);
            if (!data) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            return data;

        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }

    async getArticlelist(payload: ArticleRequest.GetArticle) {
        try {
            let { page, limit, sortType } = payload;
            const { articleId, sortBy } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let query;
            sortingType = {
                updatedAt: sortType,
            };

            if (payload.categoryId) {
                query = {
                    categoryId: payload.categoryId,
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                    _id: {
                        $ne: {
                            articleId,
                        },
                    },
                };
            }
            else {
                query = {
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                };
            }
            const pipeline = [
                { $match: query },
                { $sort: sortingType },
            ];

            const articleList = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
            return articleList;
        }

        catch (error) {
            utils.consolelog('errrorArticlelist', error, true);
            return Promise.reject(error);
        }
    }

}

export const ArticleE = new ArticleClass();

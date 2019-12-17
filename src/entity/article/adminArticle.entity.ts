'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
import { ObjectId, ObjectID } from 'bson';
import { Types } from 'mongoose';
export class CategoryClass extends BaseEntity {
    constructor() {
        super('ArticleCategories');
    }

    async addArticleName(payload: ArticleRequest.AddCategoriesName) {
        const criteria = {
            name: payload.name,
        };
        return await this.DAOManager.insert(this.modelName, criteria);
    }

    async getCategoryList(payload) {
        try {
            const { page, limit, sortType = -1 } = payload;
            const paginateOptions = {
                page: page || 1,
                limit: limit || Constant.SERVER.LIMIT,
            };
            const sortingType = {
                createdAt: sortType,
            };
            const query = {
                $or: [
                    { status: Constant.DATABASE.ArticleCategoryStatus.ACTIVE },
                    { status: Constant.DATABASE.ArticleCategoryStatus.BLOCK },
                ],
            };
            const matchPipeline = [
                { $match: query },
                {
                    $sort: sortingType,
                },
            ];
            const pipeline = [
                {
                    $lookup: {
                        from: 'articles',
                        let: { categoryId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$categoryId', '$$categoryId'],
                                    },
                                },
                            },
                        ],
                        as: 'articles',
                    },
                },
                {
                    $project: {
                        name: 1,
                        articles: {
                            $size: '$articles',
                        },
                        createdAt: 1,
                        updatedAt: 1,
                        status: 1,
                    },
                },
            ];
            const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, pipeline).aggregate(this.modelName);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateCategoryList(payload) {
        try {
            const criteria = {
                _id: payload.id,
            };
            delete payload['id'];
            const articleStatusCriteria = {
                categoryId: payload.id,
            };
            if (payload.name) {
                return await this.DAOManager.findAndUpdate(this.modelName, criteria, { name: payload.name });

            } else if (payload.status) {
                const statusData = await this.DAOManager.findAndUpdate(this.modelName, criteria, { status: payload.status });
                this.DAOManager.updateMany('Article', articleStatusCriteria, { status: payload.status }, {});
                return statusData;
            }

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async addSellingArticle() {
        try {
            const criteria = {
                name: 'SELLING',
            };
            const insert = {
                // $set: {
                _id: Types.ObjectId('5df7515fd72c62a525cc9333'),
                name: 'SELLING',
                status: 'Active',
                // },
            };
            const checkData = await this.DAOManager.findOne(this.modelName, criteria, {});
            // this.DAOManager.
            if (!checkData) {
                this.DAOManager.save(this.modelName, insert);
                return;
            }
            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleCategoryE = new CategoryClass();

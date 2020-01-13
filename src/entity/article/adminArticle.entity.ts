'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
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
            return  await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, pipeline).aggregate(this.modelName);
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
                const data = await this.DAOManager.findAndUpdate(this.modelName, criteria, { name: payload.name });
                return data;
            } else if (payload.status) {
                const statusData = await this.DAOManager.findAndUpdate(this.modelName, criteria, { status: payload.status });
                this.DAOManager.updateMany('Article', articleStatusCriteria, { status: payload.status }, {});
                return statusData;
            }

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleCategoryE = new CategoryClass();

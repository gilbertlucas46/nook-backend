'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import * as utils from '@src/utils';
export class CategoryClass extends BaseEntity {
    constructor() {
        super('ArticleCategories');
    }

    async addArticleName(payload) {
        console.log('payloadpayloadpayloadpayload', payload);
        console.log('this.modelNamethis.modelNamethis.modelNamethis.modelName', this.modelName);
        return await this.DAOManager.insert(this.modelName, payload);
    }

    async getCategoryList(payload) {
        try {
            let { page, limit, searchTerm, sortType } = payload;

            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const skip = (limit * (page - 1));
            sortingType = {
                createdAt: sortType,
            };
            const promise = [];
            const query = {
                $or: [
                    { status: Constant.DATABASE.ArticleCategoryStatus.ACTIVE },
                    { status: Constant.DATABASE.ArticleCategoryStatus.BLOCK },
                ],
            };

            const pipeline = [
                { $match: query },
                { $skip: skip },
                { $limit: limit },
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
            const data = await this.DAOManager.paginate(this.modelName, pipeline);
            console.log('datadatadatadatadatadata', data);

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
                const data = await this.DAOManager.findAndUpdate(this.modelName, criteria, { name: payload.name });
                return data;
            } else if (payload.status) {
                const statusData = await this.DAOManager.findAndUpdate(this.modelName, criteria, { status: payload.status });
                const updateData = this.DAOManager.updateMany('Article', articleStatusCriteria, { status: payload.status }, {});
                return statusData;
            }

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleCategoryE = new CategoryClass();

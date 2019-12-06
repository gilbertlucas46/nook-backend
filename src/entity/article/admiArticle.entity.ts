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
                status: Constant.DATABASE.ArticleCategoryStatus.ACTIVE,
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
                    },
                },
            ];
            const data = await this.DAOManager.paginate(this.modelName, pipeline);
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
            const updateData = {
                status: payload.status,
                name: payload.name,
            };
            const data = await this.DAOManager.findAndUpdate(this.modelName, criteria, updateData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleCategoryE = new CategoryClass();

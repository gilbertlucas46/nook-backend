'use strict';
import { BaseEntity } from './base.entity';
import { ArticleRequest } from '../interfaces/article.interface';
import { UserRequest } from '../interfaces/user.interface';
import * as Constant from '../constants';
import * as utils from '../utils';
import { Types } from 'mongoose';
export class ArticleClass extends BaseEntity {
    constructor() {
        super('Article');
    }

    async getArticlelist(payload: ArticleRequest.GetArticle) {
        try {
            let { page, limit } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
            const skip = (limit * (page - 1));
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
                        categoryName: 1,
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
                    $group: {
                        _id: '$categoryId',
                        article: { $push: '$_id' },
                    },
                },
                {
                    $project: {
                        cityId: '$_id',
                        articleCount: { $cond: { if: { $isArray: '$article' }, then: { $size: '$article' }, else: 0 } },
                        article: 1,
                    },
                },
                {
                    $sort: {
                        articleCount: -1,
                    },
                },
                { $skip: skip },
                { $limit: limit },
            ];

            const data = await this.DAOManager.aggregateData(this.modelName, pipeline);
            if (!data) return Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND;
            return Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data;

        } catch (error) {
            utils.consolelog('errrorArticlelist', error, true);
            return Promise.reject(error);
        }
    }

    async showAllArticle() {
        try {

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleE = new ArticleClass();

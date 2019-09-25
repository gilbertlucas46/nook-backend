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
            let { page, limit, sortBy, sortType, } = payload;
            const { articleId } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            // const matchObject: any = { $match: {} };
            let query;
            sortingType = {
                createdAt: sortType,
            };
            // if (sortBy) {
            //     switch (sortBy) {
            //         case 'price':
            //             sortBy = 'price';
            //             sortingType = {
            //                 'property_basic_details.sale_rent_price': sortType,
            //             };
            //             break;
            //         case 'date':
            //             sortBy = 'date';
            //             sortingType = {
            //                 createdAt: sortType,
            //             };
            //             break;
            //         case 'isFeatured':
            //             sortBy = 'isFeatured';
            //             sortingType = {
            //                 isFeatured: sortType,
            //             };
            //         default:
            //             sortBy = 'createdAt';
            //             sortingType = {
            //                 createdAt: sortType,
            //             };
            //             break;
            //     }
            // }

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
            } else if (payload.articleId) {
                query = {
                    _id: Types.ObjectId(payload.articleId),
                };
            } else {
                query = {
                    status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE.NUMBER,
                };
            }
            const pipeline = [
                {
                    $match: query,
                },
                { $sort: sortingType },
            ];

            const articleList = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
            return articleList;

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

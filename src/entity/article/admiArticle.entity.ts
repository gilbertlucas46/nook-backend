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
            // sortingType = {
            //     [sortBy]: sortType,
            // };
            // const criteria = {
            //     userId: userData._id,
            // };
            // promiseArray.push(this.DAOManager.findAll(this.modelName, criteria, {}, { limit, skip, sort: sortingType }));

            promise.push(this.DAOManager.findAll(this.modelName, {}, {}, { limit, skip, sort: sortingType }));
            promise.push(this.DAOManager.count(this.modelName, {}));
            const [data, total] = await Promise.all(promise);
            return { data, total };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateCategoryList(payload) {
        try {
            return await this.DAOManager.findAndUpdate(this.modelName, { _id: payload.id }, { name: payload.name });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleCategoryE = new CategoryClass();

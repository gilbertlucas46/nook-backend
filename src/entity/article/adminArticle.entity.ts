'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '@src/constants';
import { Types } from 'mongoose';
import { types } from 'util';
export class CategoryClass extends BaseEntity {
    constructor() {
        super('ArticleCategories');
    }

    async addArticleName(payload: ArticleRequest.AddCategoriesName) {
        try {
            // const { name } = payload;
            const checkContainQmark = payload.title.includes('?');
            console.log('3333333333333333333333333333333');
            let name1;
            // let name1 = urlSlug(name,
            //     // {
            //     '-',
            //     false,
            //     // transformer: urlSlug.transformers.uppercase,
            //     // }
            // );

            console.log('nameeeeeeeee', name1);
            // console.log('nmae22222222222', name2);
            payload.name = payload.title.replace(/\s+/g, '-').replace(/\//g, '_').toLowerCase();
            console.log('payload.titlepayload.titlepayload.title', payload.title);

            // if (checkContainQmark) {
            //     payload.title = payload.title.concat(' ?');
            // }
            const criteria = {
                name: payload.name,
                // name: payload.name,
            };
            const checkName = await this.DAOManager.findOne(this.modelName, criteria, {});
            console.log('checkNamecheckNamecheckName', checkName);

            if (!checkName) {
                const dataToSave = {
                    title: payload.title,
                    name: payload.name,
                };
                return await this.DAOManager.insert(this.modelName, dataToSave);
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }       // return 1
        } catch (error) {
            return Promise.reject(error);
        }
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
            let { name, status, title } = payload
            const criteria = {
                _id: Types.ObjectId(payload.id),
            };
            delete payload['id'];
            const articleStatusCriteria = {
                categoryId: Types.ObjectId(payload.id),
            };
            // let title;

            if (title) {
                payload.name = title.replace(/\s+/g, '-').replace(/\//g, '_').toLowerCase();


                const criteria1 = {
                    name: payload.name,
                };
                // const checkContainQmark = title.includes('?');
                // if (checkContainQmark) {
                //     payload.title = checkContainQmark.concat(' ?');
                // }

                const checkAlreadyAdded = await this.DAOManager.findOne(this.modelName, criteria1, {});
                console.log('checkAlreadyAddedcheckAlreadyAddedcheckAlreadyAdded', checkAlreadyAdded);

                // checkAlreadyAdded.
                if (checkAlreadyAdded != null && checkAlreadyAdded.name === payload.name) {
                    // if(urlSlug.revert(checkAlreadyAdded.name, '-', urlSlug.transformers.titlecase) === urlSlug(name, '-', false)) {
                    return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
                } else {
                    const dataToUpdate = {
                        name: payload.name,
                        title: payload.title,
                    };
                    const data = await this.DAOManager.findAndUpdate(this.modelName, criteria, dataToUpdate);
                    console.log('data>A>>>>>', data);

                    return data;
                }
                //     '-',
                //     urlSlug.transformers.titlecase) ===payload.)
                // console.log('dartaaaaaaaaaaa', data);
                // return data;

            } else if (payload.status) {
                const statusData = await this.DAOManager.findAndUpdate(this.modelName, criteria, { status: payload.status });
                this.DAOManager.updateMany('Article', articleStatusCriteria, { status: payload.status }, {});
                return statusData;
            }

        } catch (error) {
            return Promise.reject(error);
        }
    }

    // async addSellingArticle() {
    //     try {
    //         const criteria = {
    //             name: 'SELLING',
    //         };
    //         const insert = {
    //             // $set: {
    //             _id: Types.ObjectId(Constant.SERVER.SELLING_ARTICLE_ID),
    //             name: 'SELLING',
    //             status: Constant.DATABASE.ARTICLE_STATUS.ACTIVE,
    //             // },
    //         };
    //         const checkData = await this.DAOManager.findOne(this.modelName, criteria, {});
    //         // this.DAOManager.
    //         if (!checkData) {
    //             this.DAOManager.save(this.modelName, insert);
    //             return;
    //         }
    //         return;
    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }
}

export const ArticleCategoryE = new CategoryClass();

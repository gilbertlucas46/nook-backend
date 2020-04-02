import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';
import * as utils from '@src/utils';
import { describe } from 'joi';
import { pipeline } from 'stream';
import { Types } from 'mongoose';

export class HelpCenter {

    getTypeAndDisplayName(findObj, num) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }

    /**
     * @function createHelpCenter
     * @description create helpcenter by admin
     * @payload  CreateHelpCenter
     * return {}
     */
    async createHelpCenter(payload: helpCenterRequest.CreateHelpCenter, adminData) {
        try {
            let result: any;
            if (payload.categoryId) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_TYPE, payload.categoryId);
            }
            payload['userId'] = adminData._id;
            payload['categoryType'] = result.TYPE;
            payload['userRole'] = adminData.type;
            return await ENTITY.HelpCenterE.createOneEntity(payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function getHelpCenter
     * @description getgelpcenter
     * @payload  GetHelpCenter
     * return {}
     */

    async getHelpCenter(payload: helpCenterRequest.GetHelpCenter) {
        try {
            const criteria = { _id: payload.id };
            return await ENTITY.HelpCenterE.getOneEntity(criteria, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function deleteHelpCenter
     * @description delete helpcenter hard delete
     * @payload  DeleteHelpCenter
     * return {}
     */

    async deleteHelpCenter(payload: helpCenterRequest.DeleteHelpCenter) {
        try {
            const criteria = {
                _id: payload.id,
            };
            return await ENTITY.HelpCenterE.removeEntity(criteria);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function updateHelpCenter
     * @description update helpcenter
     * @payload  IupdateHelpCenter
     * return {}
     */

    async updateHelpCenter(payload: helpCenterRequest.IupdateHelpCenter, adminData) {
        try {
            let result;
            const dataToSet: any = {};
            const criteria = {
                _id: payload.id,
            };

            if (payload.categoryId) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_TYPE, payload.categoryId);
            }
            dataToSet.$set = {
                ...payload,
                // categoryId: payload.categoryId,
                categoryType: result.TYPE,
                // videoUrl: payload.videoUrl,
                userId: adminData._id,
                firstName: adminData.firstName,
                name: adminData.name || '',
                // userRole: adminData.type,
                // description: payload.description,
            };

            dataToSet.$push = {
                actions: {
                    userRole: adminData.type,
                    name: adminData.name,
                    firstName: adminData.firstName,
                    userId: adminData._id,
                    actionTime: new Date().getTime(),
                },
            };
            return await ENTITY.HelpCenterE.updateOneEntity(criteria, dataToSet);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function getHelpCenterCategoryBygroup
     * @description helpcenter categories
     * @payload
     * return
     */

    async getHelpCenterCategoryBygroup() {
        try {
            return await ENTITY.HelpCenterE.getHelpCenterCategoryBygroup();
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function getHelpCenterByCategoryId
     * @description helpcenter by categoryId
     * @payload :id of category
     * return
     */

    async getHelpCenterByCategoryId(id) {
        try {
            return await ENTITY.HelpCenterE.getHelpCenterByCategory(id);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @function isArticleHelpful
     * @description article helpful by user on the basis of userip address
     * @payload :IsHelpful
     * return {} / success
     */

    async isArticleHelpful(payload: helpCenterRequest.IsHelpful, userData?) {
        try {
            return await ENTITY.HelpfulE.createhelpfulStatus(payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getUserHelpCenter(payload, userData) {
        try {
            const { searchTerm, categoryId } = payload;
            let query: object = {};
            let pipeline: any = [];
            if (searchTerm) {
                query = {
                    // $and:{status:}
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { categoryType: { $regex: searchTerm, $options: 'i' } },
                    ],
                };
                // const data = await ENTITY.HelpCenterE.getMultiple(query, {});
                // return data;

            } else if (categoryId) {
                query = {
                    categoryId,
                };
                return ENTITY.HelpCenterE.getMultiple(query, {});
            } else {
                query = {
                };
            }
            const sortingType = {
                title: 1,
            };

            pipeline = [
                {
                    $facet: {
                        // PROPERTIES: [
                        //     {
                        //         $match: {

                        //             categoryType: 'PROPERTIES',
                        //             $or: [
                        //                 query,
                        //             ],
                        //         },
                        //     },
                        //     { $project: { _id: 1, title: 1, categoryId: 1 } },
                        //     { $sort: sortingType },
                        // ],

                        ACCOUNT: [{
                            $match: {
                                categoryType: 'ACCOUNT',
                                $or: [
                                    query,
                                ],
                            },
                        },
                        { $project: { _id: 1, title: 1, categoryId: 1 } },
                        { $sort: sortingType },
                        ],
                        BILLING: [{
                            $match: {
                                categoryType: 'BILLING',
                                $or: [
                                    query,
                                ],
                            },
                        },
                        { $project: { _id: 1, title: 1, categoryId: 1 } },
                        { $sort: sortingType },
                        ],
                        HOME_LOANS: [{
                            $match: {
                                categoryType: 'HOME_LOANS',
                                $or: [
                                    query,
                                ],
                            },
                        },
                        { $project: { _id: 1, title: 1, categoryId: 1 } },
                        { $sort: sortingType },
                        ],
                    },
                },
            ];
            const data = await ENTITY.HelpCenterE.aggregate(pipeline);
            return data[0];
            // }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getRelatedArticles(payload, userData) {
        try {
            const { searchTerm, categoryId, id } = payload;
            const query: any = {};
            let seacrhObject = {};

            query['categoryId'] = categoryId;

            if (id) {
                query['_id'] = {
                    $ne: Types.ObjectId(id),
                };
            }
            const sortingType = {
                title: 1,
            };
            if (searchTerm) {
                seacrhObject = {
                    // $and:{status:}
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { categoryType: { $regex: searchTerm, $options: 'i' } },
                    ],
                };

            } else {
                seacrhObject = {

                };
            }

            const pipeline = [
                {
                    $match: query,
                },
                {
                    $match: seacrhObject,
                },
                { $sort: sortingType },
            ];

            const data = await ENTITY.HelpCenterE.aggregate(pipeline);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let HelpCenterService = new HelpCenter();
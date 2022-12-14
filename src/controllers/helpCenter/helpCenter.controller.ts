import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';
import * as utils from '@src/utils';
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
            payload['userId'] = adminData._id;

            // if (payload.categoryId) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_CATEGORY, payload.categoryId);
            // }
            // payload['userId'] = adminData._id;
            // payload['categoryType'] = result.TYPE;
            // payload['userRole'] = adminData.type;
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
                categoryType: payload.type,
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
                    categoryId: Types.ObjectId(categoryId),
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
                        ACCOUNT: [{
                            $match: {
                                type: Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE,
                                // categoryType: 'ACCOUNT'
                                categoryId: Types.ObjectId('5ee103fc8f2f61a8ca114797'),
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
                                type: Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE,
                                // categoryType: 'HOME_LOANS',
                                categoryId: Types.ObjectId('5ee103fc8f2f61a8ca114796'),
                                $or: [
                                    query,
                                ],
                            },
                        },
                        { $project: { _id: 1, title: 1, categoryId: 1 } },
                        { $sort: sortingType },
                        ],

                        FAQ: [{
                            $match: {
                                type: Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE,
                                // categoryType: 'FAQ',
                                categoryId: Types.ObjectId('5ee103fc8f2f61a8ca114795'),
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

            query['categoryId'] = Types.ObjectId(categoryId);

            if (payload.type) {
                query['type'] = payload.type;
            }

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



    async getHelpcenter(payload: helpCenterRequest.AdminGetHelpCnter) {
        try {
            const data = await ENTITY.HelpCenterE.adminGetHelpCenter(payload);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }


















    //  async getHelpcenter(payload) {
    // try {
    //         const aggregate = [
    //             {
    //                 $match: {
    //                     _id: payload.categoryId,
    //                 },
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'helpcenters',
    //                     // let: { hc_Id: '$$ROOT._id' },
    //                     as: 'helpcenterData',
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 categoryId: Types.ObjectId(payload.categoryId),
    //                             },
    //                         },
    //                         {
    //                             $project: {
    //                                 title: 1,
    //                                 createdAt: 1,
    //                                 categoryType: 1,
    //                             },
    //                         },
    //                     ],
    //                 },
    //             }];

    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }



}

export let HelpCenterService = new HelpCenter();
import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';
import * as utils from '@src/utils';
import { isDate } from 'util';

export class HelpCenterCategory {

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
    async adminCreateCategory(payload, adminData) {
        try {
            // let result: any;
            // if (payload.categoryId) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_CATEGORY, payload.categoryId);
            // }
            // payload['userId'] = adminData._id;
            // payload['categoryType'] = result.TYPE;
            // payload['userRole'] = adminData.type;
            const criteria = {
                type: payload.type,
                name: payload.name,
            };
            const checkAlreadyExist = await ENTITY.HelpCenterCatgoryE.getOneEntity(criteria, {});
            console.log('checkAlreadyExistcheckAlreadyExistcheckAlreadyExist', checkAlreadyExist);
            if (checkAlreadyExist) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }
            payload['addedBy'] = {
                userRole: adminData.type,
                adminId: adminData._id,
            };

            payload['userType'] = adminData.type;
            const data = await ENTITY.HelpCenterCatgoryE.createOneEntity(payload);
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }


    /**
     * @description admin update helpcenter category
     */
    async adminUpdateCategory(payload: helpCenterRequest.IhelpCenterCategoryUpdate, adminData) {
        try {
            // let result: any;
            // if (payload.categoryId) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_CATEGORY, payload.categoryId);
            // }
            // payload['userId'] = adminData._id;
            // payload['categoryType'] = result.TYPE;
            // payload['userRole'] = adminData.type;
            const criteria = {
                name: payload.name,
                // _id: { $ne: payload.categoryId },
            };

            const checkAlreadyExist = await ENTITY.HelpCenterCatgoryE.getOneEntity(criteria, {});
            console.log('checkAlreadyExistcheckAlreadyExistcheckAlreadyExist', checkAlreadyExist);
            if (checkAlreadyExist) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }

            const dataToUpdate: any = {};
            dataToUpdate.$push = {
                applicationStage: {
                    userRole: adminData.type,
                    adminId: adminData._id,
                },
            };

            payload['userType'] = adminData.type;
            const data = await ENTITY.HelpCenterCatgoryE.createOneEntity(payload);
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    /**
     * @description admin update catgeory status
     */

    async adminUpdateCatgoryStatus(payload: helpCenterRequest.IhelpCenterCategoryUpdate, adminData) {
        try {
            // let result: any;
            // if (payload.categoryId) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_CATEGORY, payload.categoryId);
            // }
            // payload['userId'] = adminData._id;
            // payload['categoryType'] = result.TYPE;
            // payload['userRole'] = adminData.type;
            const criteria = {
                _id: payload.categoryId,
            };
            const dataToUpdate: any = {};

            dataToUpdate.$set = { status: payload.status };

            // dataToUpdate['status'] = payload.status,
            dataToUpdate.$push = {
                applicationStage: {
                    userRole: adminData.type,
                    adminId: adminData._id,
                },
            };

            const updatedDa = await ENTITY.HelpCenterCatgoryE.updateOneEntity(criteria, dataToUpdate);
            return;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @description admin get the helpcneter by category
     */

    async adminGetCategory(payload) {
        try {
            const pipeline = [
                // {
                //     status: Constant.DATABASE.HELP_CENTER_CATEGORY_STATUS.ACTIVE,
                // },
                // {
                //     $facet: {
                //         BANK_CATEGORY1: [{
                //             $match: {
                //                 category: 'STAFF_FAQ',
                //             },
                //         },
                //             //                         { $project: { _id: 1, title: 1, categoryId: 1 } },
                //             //                             // { $sort: sortingType },
                //         ],
                //         STAFF_CATEGORY: [{
                //             $match: {
                //                 category: 'BANK_FAQ',
                //             }
                //         }]
                //     },

                // },
                // {
                //     $project:
                //     {
                //         BANK_CATEGORY: '$BANK_CATEGORY1.name',
                //         STAFF_CATEGORY: '$STAFF_CATEGORY.name',
                //     },
                // },
                {
                    $match: {
                        category: payload.type,
                        status: Constant.DATABASE.HELP_CENTER_CATEGORY_STATUS.ACTIVE,
                    }
                }
            ];
            const data = await ENTITY.HelpCenterCatgoryE.aggregate(pipeline);
            console.log('datadatadatadatadata', data);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let HelpCenterCategoryService = new HelpCenterCategory();
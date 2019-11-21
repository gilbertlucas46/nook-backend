import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';

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
            const data = await ENTITY.HelpCenterE.createOneEntity(payload);
            return data;
        } catch (error) {
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
            const criteria = {
                _id: payload.id,
            };
            const data = await ENTITY.HelpCenterE.getOneEntity(criteria, {});
            return data;
        } catch (error) {
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
                categoryId: payload.categoryId,
                categoryType: result.TYPE,
                videoUrl: payload.videoUrl,
                userId: adminData._id,
                userRole: adminData.type,
                description: payload.description,
            };

            dataToSet.$push = {
                actions: {
                    userRole: adminData.type,
                    userId: adminData._id,
                    actionTime: new Date().getTime(),
                },
            };
            const data = await ENTITY.HelpCenterE.updateOneEntity(criteria, dataToSet);
            return data;
        } catch (error) {
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
            const data = await ENTITY.HelpCenterE.getHelpCenterCategoryBygroup();
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @function getHelpCenterByCategoryId
     * @description helpcenter by categoryId
     * @payload :id of category
     * return
     */

    async getHelpCenterByCategoryId(id: number) {
        try {
            const data = await ENTITY.HelpCenterE.getHelpCenterByCategory(id);
            return data;
        } catch (error) {
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
            const data = await ENTITY.HelpfulE.createhelpfulStatus(payload);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export let HelpCenterService = new HelpCenter();
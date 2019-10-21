import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';
import { request } from 'http';
import { date } from 'joi';
export class HelpCenter {

    getTypeAndDisplayName(findObj, num) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }

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

    async updateHelpCenter(payload, adminData) {
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
                videoUrl: payload.imageUrl,
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

    async getHelpCenterCategoryBygroup() {
        try {
            const data = await ENTITY.HelpCenterE.getHelpCenterCategoryBygroup();
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getHelpCenterByCategoryId(id: number) {
        try {
            const data = await ENTITY.HelpCenterE.getHelpCenterByCategory(id);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

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
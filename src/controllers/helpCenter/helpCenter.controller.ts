import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import * as Constant from '../../constants';
export class HelpCenter {
    // constructor()
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
            let result;
            // const dataToSave = {
            console.log('adminData', adminData);

            if (payload.categoryId) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.HELP_CENTER_TYPE, payload.categoryId);
            }

            payload['userId'] = adminData['_id'];
            payload['createdAt'] = new Date().getTime();
            payload['updtedAt'] = new Date().getTime();
            payload['categoryType'] = result.type;
            payload['userRole'] = adminData.type;
            // }
            console.log('payload>>>>>>>>>>>>>>>>>>>>>', payload);

            const data = await ENTITY.HelpCenterE.createOneEntity(payload);
            console.log('datadatadatadata', data);
            return data;
        } catch (error) {
            console.log('errorrrrrrrrrrrrrrrrrrrrrr', error);
            return Promise.reject(error);
        }
    }

    async getHelpCenter(payload: helpCenterRequest.GetHelpCenter) {
        try {
            const criteria = {
                categoryId: payload.categoryId,
            };
            const data = await ENTITY.HelpCenterE.getOneEntity(criteria, {});
            console.log('datadatadatadata', data);
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
}

export let HelpCenterService = new HelpCenter();
import * as ENTITY from '@src/entity';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
export class HelpCenter {
    // constructor()
    async createHelpCenter(payload: helpCenterRequest.CreateHelpCenter) {
        try {
            // const dataToSave = {
            payload['createdAt'] = new Date().getTime();
            payload['updtedAt'] = new Date().getTime();
            // }

            const data = await ENTITY.HelpCenterE.createOneEntity(payload);
            console.log('datadatadatadata', data);
            return data;
        } catch (error) {
            console.log('errorrrrrrrrrrrrrrrrrrrrrr', error);
            return Promise.reject(error);
        }
    }
}

export let HelpCenterService = new HelpCenter();
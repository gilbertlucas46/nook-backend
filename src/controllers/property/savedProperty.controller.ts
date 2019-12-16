import * as ENTITY from '@src/entity';
import { SavePropertyRequest } from '@src/interfaces/saveProperty.interface';
import * as utils from '@src/utils';
export class SavedProperty {
    async saveProperty(payload: SavePropertyRequest.SaveProperty, userData) {
        try {
            const dataToSave = {
                userId: userData._id,
                propertyId: payload.propertyId,
            };
            const criteria = {
                userId: userData._id,
                propertyId: payload.propertyId,
            };
            let data = await ENTITY.SavedPropertyE.getOneEntity(criteria, {});
            if (!data) { data = await ENTITY.SavedPropertyE.createOneEntity(dataToSave); }
            else { data = await ENTITY.SavedPropertyE.removeEntity(dataToSave); }
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async savePropertyList(payload: SavePropertyRequest.SavePropertyList, userData) {
        try {
            return await ENTITY.SavedPropertyE.getList(payload, userData);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export const SavedPropertyServices = new SavedProperty();
import * as ENTITY from '@src/entity';
import * as Constant from '@src/constants';
import { SavePropertyRequest } from '@src/interfaces/saveProperty.interface';
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
            return Promise.reject(error);
        }
    }

    async savePropertyList(payload: SavePropertyRequest.SavePropertyList, userData) {
        try {
            const data = await ENTITY.SavedPropertyE.getList(payload, userData);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const SavedPropertyServices = new SavedProperty();
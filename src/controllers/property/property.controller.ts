
import * as config from 'config';
import * as UniversalFunctions from '../../utils'
import * as Constant from '../../constants/app.constant'
import * as ENTITY from '../../entity'

export class PropertyController {
    constructor() { }

    async addProperty(payload: PropertyRequest.PropertyData, userData: UserRequest.userData) {
        try {
            let criteria = {
                _id: payload.propertyId
            }
            console.log('userDataaa', userData);

            payload['updatedAt'] = new Date().getTime()

            if (payload.propertyId) {
                let updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
                return updateData;
            }
            let userId = userData._id;
            payload['userId'] = userId;
            payload['property_added_by'] = {};
            payload['property_added_by']['userId'] = userData._id;
            payload['property_added_by']['phoneNumber'] = userData.phoneNumber;
            payload['property_added_by']['imageUrl'] = userData.profilePicUrl
            payload['property_added_by']['userName'] = userData.userName
            let propertyData = await ENTITY.PropertyE.createOneEntity(payload);
            return propertyData;

        } catch (error) {
            return Promise.reject(error)
        }
    }
}

export let PropertyService = new PropertyController();

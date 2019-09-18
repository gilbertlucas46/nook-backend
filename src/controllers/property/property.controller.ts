
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';
export class PropertyController {

	getTypeAndDisplayName(findObj, num: number) {
		const obj = findObj;
		const data = Object.values(obj);
		const result = data.filter((x: any) => {
			return x.NUMBER === num;
		});
		return result[0];
	}

	async addProperty(payload: PropertyRequest.PropertyData, userData: UserRequest.UserData) {
		try {
			let result;
			let propertyAction;
			const criteria = {
				_id: payload.propertyId,
			};
			if (payload.property_basic_details.property_for_number) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_FOR, payload.property_basic_details.property_for_number);
			}
			payload.property_basic_details.property_for_string = result.TYPE;
			payload.property_basic_details.property_for_displayName = result.DISPLAY_NAME;
			propertyAction = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_ACTIONS, Constant.DATABASE.PROPERTY_ACTIONS.PENDING.NUMBER);
			payload.property_address.location['type'] = 'Point';

			const userId = userData._id;
			payload.userId = userId;
			payload.property_added_by = {
				userId: userData._id,
				phoneNumber: userData.phoneNumber,
				imageUrl: userData.profilePicUrl,
				userName: userData.userName,
			};
			payload.property_status = Constant.DATABASE.PROPERTY_STATUS.PENDING;
			payload.propertyActions = [{
				actionString: propertyAction.TYPE,
				actionDisplayName: propertyAction.DISPLAY_NAME,
				actionPerformedBy: {
					userId: userData._id,
					userType: userData.type,
					actionTime: new Date().getTime(),
				},
			}];

			if (payload.propertyId) {
				payload.updatedAt = new Date().getTime();
				const updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
				return updateData;
			}
			const propertyData = await ENTITY.PropertyE.createOneEntity(payload);
			return propertyData;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async searchProperties(payload: PropertyRequest.SearchProperty) {
		try {
			const propertyData = await ENTITY.PropertyE.getPropertyList(payload);
			return propertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async nearbyProperties(payload: PropertyRequest.NearByProperty) {
		try {
			// let propertyData = await ENTITY.PropertyE.aggregate([
			//     {
			//         '$geoNear': {
			//             near: { type: "Point", "coordinates": [28.535517, 77.391029] },
			//             maxDistance: 100000,
			//             query: pipeLine,
			//             distanceField: "calculatedDistance",
			//             spherical: true
			//         }
			//     },
			//     {
			//         $project: {
			//             _id: 1,
			//             property_basic_details: 1,
			//             createdAt: 1,
			//             property_address: 1
			//         }
			//     }
			// ]);
			const propertyData = await ENTITY.PropertyE.getPropertyList(payload);
			return propertyData;
		} catch (err) {
			utils.consolelog('error', err, true);
			return Promise.reject(err);
		}
	}
	async userPropertyByStatus(payload, userData: UserRequest.UserData) {
		try {
			const data = await ENTITY.UserPropertyE.getUserPropertyList(payload, userData);
			return data;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async saveAsDraft(payload, userData: UserRequest.UserData) {
		try {
			let result;
			let propertyAction;
			if (payload.property_basic_details.property_for_number) {
				result = await this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_FOR, payload.property_basic_details.property_for_number);
				payload.property_basic_details = {
					property_for_string: result.TYPE,
					property_for_displayName: result.DISPLAY_NAME,
				};
			}

			propertyAction = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_ACTIONS, Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.NUMBER);
			payload.property_status = {
				number: Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
				status: Constant.DATABASE.PROPERTY_STATUS.DRAFT.TYPE,
				displayName: Constant.DATABASE.PROPERTY_STATUS.DRAFT.DISPLAY_NAME,
			};

			const userId = userData._id;
			payload.userId = userId;
			payload.property_added_by = {
				userId: userData._id,
				phoneNumber: userData.phoneNumber,
				imageUrl: userData.profilePicUrl,
				userName: userData.userName,
			};
			payload.propertyActions = [{
				actionString: propertyAction.TYPE,
				actionDisplayName: propertyAction.DISPLAY_NAME,
				actionPerformedBy: {
					userId: userData._id,
					userType: userData.type,
					actionTime: new Date().getTime(),
				},
			}];

			const propertyData = await ENTITY.PropertyE.createOneEntity(payload);
			return propertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async updatePropertyStatus(payload: PropertyRequest.UpdatePropertyByAction, userData: UserRequest.UserData) {
		try {
			const dataToSet: any = {};
			const criteria = {
				userId: userData._id,
				_id: payload.propertyId,
			};
			if (payload.status) {
				dataToSet.$set = {
					property_status: {
						number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
						status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
						displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME,
					},
				};
				dataToSet.$push = {
					propertyActions: {
						actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.NUMBER,
						actionString: Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.TYPE,
						actionPerformedBy: {
							userId: userData._id,
							userType: userData.type,
						},
						actionTime: new Date().getTime(),
					},
				};
			} else if (payload.upgradeToFeature) {
				dataToSet.$set = {
					isFeatured: payload.upgradeToFeature,
				};
				dataToSet.$push = {
					propertyActions: {
						actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
						actionString: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
						displayName: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.DISPLAY_NAME,
						actionPerformedBy: {
							userId: userData._id,
							userType: userData.type,
						},
						actionTime: new Date().getTime(),
					},
				};
			}
			const update = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet, { new: true });
			return update;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}
export let PropertyService = new PropertyController();

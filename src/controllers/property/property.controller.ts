import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';
import { exists } from 'fs';
import { Types } from 'mongoose';
export class PropertyController {

	getTypeAndDisplayName(findObj, num: number) {
		const obj = findObj;
		const data = Object.values(obj);
		const result = data.filter((x: any) => {
			return x.NUMBER === num;
		});
		return result[0];
	}
	/**
	 * @function checkSubscription
	 * @description check subscription is exist
	 * @payload : boolean
	 * return {}
	 */
	async checkSubscriptionExist(payload: PropertyRequest.PropertyData, userData: UserRequest.UserData) {
		if (payload.isFeatured) {
			const step1 = await ENTITY.SubscriptionE.checkSubscriptionExist({ userId: userData._id, featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY });
			if (step1) {
				return { isFeatured: true, subscriptionId: step1._id };
			} else {
				// return Promise.reject(Constant.STATUS_MSG.ERROR.E400.SUBSCRIPTION_NOT_EXIST({ isFeatured: false }));
				return { isFeatured: false };
			}
		} else if (payload.isHomePageFeatured) {
			const step1 = await ENTITY.SubscriptionE.checkSubscriptionExist({ userId: userData._id, featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE });
			if (step1) {
				return { isHomePageFeatured: true, subscriptionId: step1._id };
			} else {
				// return Promise.reject(Constant.STATUS_MSG.ERROR.E400.SUBSCRIPTION_NOT_EXIST({ isHomePageFeatured: false }));
				return { isHomePageFeatured: false };
			}
		} else {
			return {};
		}
	}
	/**
	 * @function addProperty
	 * @description  add property
	 * @payload : PropertyData
	 * return {}
	 */
	async addProperty(payload: PropertyRequest.PropertyData, userData: UserRequest.UserData) {
		try {
			console.log('userDatauserData', userData);

			let result;
			let propertyAction;
			const promiseArray = [];
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

			payload.property_status = {};
			payload.property_status['number'] = Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER;
			payload.property_status['status'] = Constant.DATABASE.PROPERTY_STATUS.PENDING.TYPE;
			payload.property_status['displayName'] = Constant.DATABASE.PROPERTY_STATUS.PENDING.DISPLAY_NAME;

			const userId = userData._id;
			payload.userId = userId;

			payload.property_added_by = {
				userId: userData._id,
				phoneNumber: userData.phoneNumber,
				profilePicUrl: userData.profilePicUrl,
				userName: userData.userName,
				firstName: userData.firstName || '',
				lastName: userData.lastName || '',
				email: userData.email,
				middleName: userData.middleName || '',
				userType: userData.type,
			};

			payload.propertyActions = [{
				actionString: propertyAction.TYPE,
				actionDisplayName: propertyAction.DISPLAY_NAME,
				actionPerformedBy: {
					userId: userData._id,
					userType: userData.type,
					actionTime: new Date().getTime(),
					// property_basic_details.property_for_number: result.TYPE,
				},
			}];

			if (payload.propertyId) {
				// const enquiryCriteria = {
				// 	propertyId: payload.propertyId,
				// };
				// const enquiryDataToUpdate = {
				// 	title: payload.property_basic_details.title,
				// };
				// // promiseArray.push(ENTITY.EnquiryE.updateOneEntity(criteria, enquiryDataToUpdate));

				if (payload.subscriptionId) {
					const step1 = await ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: payload.subscriptionId, propertyId: payload.propertyId });
					// updates to prev property added to this subscription
					// const update: any = {};
					console.log('????????????????steo111111111111111111111', step1);

					if (step1.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
						payload.isFeatured = true;
						console.log('regular property');
						// update.isFeatured = false;
					}
					if (step1.featuredType === 'HOMEPAGE_PROPERTY') {
						console.log('home page property');
						payload.isHomePageFeatured = true;
						// update.isHomePageFeatured = false;
					}
					// if (step1.propertyId) {
					// 	ENTITY.PropertyE.updateOneEntity({
					// 		_id: new Types.ObjectId(step1.propertyId),
					// 	}, update);
					// }
				} else {
					// @TODO remove subscription from this property
					const criteriaSubscription = {
						propertyId: payload.propertyId,
					};
					const data = await ENTITY.SubscriptionE.updateOneEntity(criteriaSubscription, { $set: { propertyId: null } });
					console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<', data);

					// return ;
					if (data.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {
						payload.isHomePageFeatured = false
					}
					if (data.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
						payload.isFeatured = false
					}
				}
				delete payload.propertyId;
				const updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
				return { updateData };
			} else {
				payload.property_basic_details.name = payload.property_basic_details.title.replace(/\s+/g, '-').toLowerCase();
				const exist = await ENTITY.PropertyE.getOneEntity({ 'property_basic_details.name': payload.property_basic_details.name }, {});
				let data: any;
				if (exist) {
					data = await ENTITY.PropertyE.createOneEntity(payload);
					ENTITY.PropertyE.updateOneEntity({ _id: data._id }, { 'property_basic_details.name': payload.property_basic_details.name + '-' + data.propertyId });
				} else {
					data = await ENTITY.PropertyE.createOneEntity(payload);
				}
				if (payload.subscriptionId) {
					const step1 = await ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: payload.subscriptionId, propertyId: data._id });
					console.log('step1step1>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', step1);
					const update: any = {};
					if (step1.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
						// payload.isFeatured = true;
						update.isFeatured = true;
					}
					if (step1.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {
						// payload.isHomePageFeatured = true;
						update.isHomePageFeatured = true;
					}
					if (data.propertyId) {
						ENTITY.PropertyE.updateOneEntity({ _id: new Types.ObjectId(data._id) }, { $set: update });
					}
					// const step2 = await ENTITY.UserPropertyE.updateFeaturedPropertyStatus(payload);
				}
				return data;
			}
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function searchProperties
	 * @description user search property
	 * @payload : SearchProperty
	 * return {}
	 */

	async searchProperties(payload: PropertyRequest.SearchProperty) {
		try {
			return await ENTITY.PropertyE.getPropertyList(payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function nearbyProperties
	 * @description near by property
	 * @payload : SearchProperty
	 * return []
	 */

	async nearbyProperties(payload: PropertyRequest.SearchProperty) {
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
			const data = await ENTITY.PropertyE.getPropertyList(payload);
			return data;
		} catch (err) {
			utils.consolelog('error', err, true);
			return Promise.reject(err);
		}
	}
	/**
	 * @function userPropertyByStatus
	 * @description  get userProperty by its status
	 * @payload : PropertyData
	 * return {}
	 */

	async userPropertyByStatus(payload: PropertyRequest.PropertyByStatus, userData: UserRequest.UserData) {
		try {
			return await ENTITY.UserPropertyE.getUserPropertyList(payload, userData);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function saveAsDraft
	 * @description user save property as a draft
	 * @payload : PropertyData and userdata['_id']
	 * return {}
	 */
	async saveAsDraft(payload: PropertyRequest.PropertyData, userData: UserRequest.UserData) {
		try {
			let result: any;
			let propertyAction: any;

			if (payload.property_basic_details.property_for_number) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_FOR, payload.property_basic_details.property_for_number);
				payload.property_basic_details['property_for_string'] = result.TYPE;
				payload.property_basic_details['property_for_displayName'] = result.DISPLAY_NAME;
			}
			propertyAction = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_ACTIONS, Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.NUMBER);
			payload.property_status = {
				number: Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
				status: Constant.DATABASE.PROPERTY_STATUS.DRAFT.TYPE,
				displayName: Constant.DATABASE.PROPERTY_STATUS.DRAFT.DISPLAY_NAME,
			};
			payload.property_address.location['type'] = 'Point';

			const userId = userData._id;
			payload.userId = userId;
			payload.property_added_by = {
				userId: userData._id,
				phoneNumber: userData.phoneNumber,
				profilePicUrl: userData.profilePicUrl,
				userName: userData.userName,
				firstName: userData.firstName || '',
				lastName: userData.lastName || '',
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

			if (payload.propertyId) {
				const criteria = { _id: payload.propertyId };
				const updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
				return updateData;
			}
			payload.property_basic_details.name = payload.property_basic_details.title.replace(/\s+/g, '-').toLowerCase();
			const exist = await ENTITY.PropertyE.getOneEntity({ 'property_basic_details.name': payload.property_basic_details.name }, {});
			let data: any;
			if (exist) {
				data = await ENTITY.PropertyE.createOneEntity(payload);
				ENTITY.PropertyE.updateOneEntity({ _id: data._id }, { 'property_basic_details.name': payload.property_basic_details.name + '-' + data.propertyId });
			} else {
				data = await ENTITY.PropertyE.createOneEntity(payload);
			}
			return data;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
	/**
	 * @function updatePropertyStatus
	 * @description user update his property sttaus as seeling or renting
	 * @payload : PropertyData and userdata['_id']
	 * return {}
	 */

	async updatePropertyStatus(payload: PropertyRequest.UpdatePropertyByAction, userData: UserRequest.UserData) {
		try {
			const dataToSet: any = {};
			const criteria = {
				userId: userData._id,
				_id: payload.propertyId,
			};
			if (payload.status) {
				const status: number = parseInt(payload.status);
				let STATUS_DATA;
				if (status === Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER) {
					STATUS_DATA = Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED;
				} else if (status === Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER) {
					STATUS_DATA = Constant.DATABASE.PROPERTY_STATUS.PENDING;
				}
				dataToSet.$set = {
					property_status: {
						number: STATUS_DATA.NUMBER,
						status: STATUS_DATA.TYPE,
						displayName: STATUS_DATA.DISPLAY_NAME,
					},
					sold_rent_time: new Date().getTime(),
				};
				dataToSet.$push = {
					propertyActions: {
						actionNumber: STATUS_DATA.NUMBER,
						actionString: STATUS_DATA.TYPE,
						actionPerformedBy: {
							userId: userData._id,
							userType: userData.type,
							actionTime: new Date().getTime(),
						},
					},
				};
				return await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet, { new: true });
			} else if (payload.subscriptionId) {

				const criteria = {
					userId: userData._id,
					_id: payload.subscriptionId,
					status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
					propertyId: payload.propertyId,
				}
				const step1 = await ENTITY.SubscriptionE.checkSubscriptionExist({ userId: userData._id, featuredType: Constant.DATABASE.FEATURED_TYPE.PROPERTY });
				// const step1 = await ENTITY.SubscriptionE.getOneEntity(criteria, {});
				// if (step1.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROPERTY) {

				// } else if (step1.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {

				// }

				if (step1) {
					dataToSet.$set = {
						isFeatured: true,
					};
					dataToSet.$push = {
						propertyActions: {
							actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
							actionString: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
							displayName: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.DISPLAY_NAME,
							actionPerformedBy: {
								userId: userData._id,
								userType: userData.type,
								action: payload.status ? Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.TYPE : Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
								actionTime: new Date().getTime(),
							},
						},
					};
					const step2 = await ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: step1._id, propertyId: payload.propertyId });
					const step3 = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet, { new: true, lean: true });
					step3.upgradeToFeature = true;
					return step3;
				} else {
					return Promise.reject(Constant.STATUS_MSG.ERROR.E400.SUBSCRIPTION_NOT_EXIST({}));
				}
			} else if (payload.upgradeToHomePageFeatured) {
				const step1 = await ENTITY.SubscriptionE.checkSubscriptionExist({ userId: userData._id, featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE });
				if (step1) {
					if (step1) {
						dataToSet.$set = {
							isHomePageFeatured: true,
						};
						dataToSet.$push = {
							propertyActions: {
								actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
								actionString: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
								displayName: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.DISPLAY_NAME,
								actionPerformedBy: {
									userId: userData._id,
									userType: userData.type,
									action: payload.status ? Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.TYPE : Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
									actionTime: new Date().getTime(),
								},
							},
						};
						const step2 = await ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: step1._id, propertyId: payload.propertyId });
						const step3 = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet, { new: true, lean: true });
						step3.upgradeToHomePageFeatured = true;
						return step3;
					} else {
						return Promise.reject(Constant.STATUS_MSG.ERROR.E400.SUBSCRIPTION_NOT_EXIST);
					}
				}
			}
		} catch (error) {
			utils.consolelog('Error', error, true);
			return Promise.reject(error);
		}
	}

	async getCityBasedData(payload: UserRequest.RecentProperty) {
		try {
			return await ENTITY.PropertyE.getPropertyViaCity(payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async adminAddProperty(payload, adminData) {
		try {

			let result;
			let propertyAction;
			const promiseArray = [];
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

			if (!payload.propertyId) {
				payload.property_status = {};
				payload.property_status['number'] = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
				payload.property_status['status'] = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.TYPE;
				payload.property_status['displayName'] = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.DISPLAY_NAME;
			}

			// payload['userId'] = payload.property_added_by.userId;

			// payload.property_added_by = {
			// 	userId: adminData._id,
			// 	phoneNumber: adminData.phoneNumber,
			// 	profilePicUrl: adminData.profilePicUrl,
			// 	userName: adminData.userName,
			// 	firstName: adminData.firstName || '',
			// 	lastName: adminData.lastName || '',
			// 	email: adminData.email,
			// 	middleName: adminData.middleName || '',
			// 	userType: adminData.type,
			// };

			payload.propertyActions = [{
				actionString: propertyAction.TYPE,
				actionDisplayName: propertyAction.DISPLAY_NAME,
				actionPerformedBy: {
					userId: adminData._id,
					userType: adminData.type,
					actionTime: new Date().getTime(),
					// property_basic_details.property_for_number: result.TYPE,
				},
			}];

			if (payload.propertyId) {
				// const enquiryCriteria = {
				// 	propertyId: payload.propertyId,
				// };
				// const enquiryDataToUpdate = {
				// 	title: payload.property_basic_details.title,
				// };
				// // promiseArray.push(ENTITY.EnquiryE.updateOneEntity(criteria, enquiryDataToUpdate));

				// let step1;
				// if (payload.subscriptionId) {
				// 	step1 = await ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: payload.subscriptionId, propertyId: payload.propertyId });
				// }
				// if (step1 && step1.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
				// 	payload.isFeatured = true;
				// }
				// if (step1 && step1.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE) {
				// 	payload.isHomePageFeatured = true;
				// }
				delete payload.propertyId;
				const updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
				return { updateData };
			} else {
				payload.approvedAt = new Date().getTime();
				payload.userId = payload.property_added_by.userId;
				payload.property_basic_details.name = await payload.property_basic_details.title.replace(/\s+/g, '-').toLowerCase();
				const exist = await ENTITY.PropertyE.getOneEntity({ 'property_basic_details.name': payload.property_basic_details.name }, {});
				let data: any;
				if (exist) {
					data = await ENTITY.PropertyE.createOneEntity(payload);
					ENTITY.PropertyE.updateOneEntity({ _id: data._id }, { 'property_basic_details.name': payload.property_basic_details.name + '-' + data.propertyId });
				} else {
					data = await ENTITY.PropertyE.createOneEntity(payload);
				}
				// let step1;
				// // if (payload.subscriptionId) {
				// // 	step1 = ENTITY.SubscriptionE.assignPropertyWithSubscription({ subscriptionId: payload.subscriptionId, propertyId: data._id });
				// // }

				// // if (step1 && step1.featuredType === Constant.DATABASE.FEATURED_TYPE.PROPERTY) {
				// // 	payload.isFeatured = true;
				// // }
				// if (step1 && step1.featuredType === Constant.DATABASE.FEATURED_TYPE.HOMEPAGE) {
				// 	payload.isHomePageFeatured = true;
				// }
				// const step2 = await ENTITY.UserPropertyE.updateFeaturedPropertyStatus(payload);
				return data;
			}
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
export let PropertyService = new PropertyController();
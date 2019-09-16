
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import { mongo } from 'mongoose';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { PropertyRequest } from '@src/interfaces/property.interface';
const { ObjectId } = mongo;
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
					//    userTypeNumber:userData.userTypeNumber,
					userTypeString: userData.type,
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
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm, propertyId, propertyType, type, label } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			let searchCriteria = {};
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			const matchObject: any = { $match: {} };

			if (searchTerm) {
				// for filtration
				searchCriteria = {
					$match: {
						$or: [
							{ 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
						],
					},
				};
			} else {
				searchCriteria = {
					$match: {
					},
				};
			}

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						sortingType = {
							sale_rent_price: sortType,
						};
						break;

					default:
						sortBy = 'createdAt';
						sortingType = {
							createdAt: sortType,
						};
						break;
				}
			} else {
				sortBy = 'createdAt';
				sortingType = {
					createdAt: sortType,
				};
			}

			if (propertyId) { matchObject.$match._id = new ObjectId(propertyId); }
			if (propertyType && propertyType !== 3) { matchObject.$match['property_basic_details.property_for_number'] = propertyType; }
			if (type && type !== 'all') { matchObject.$match['property_basic_details.type'] = type; }

			if (label && label[0] !== 'all') {
				label.forEach((item) => {
					matchObject.$match['property_basic_details.label'] = item;
				});
			}
			// creating the pipeline for mongodb
			const pipeLine = [
				matchObject,
				searchCriteria,
				{ $sort: sortingType },
			];

			const propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
			return propertyData;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async nearbyProperties(payload: PropertyRequest.NearByProperty) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			let searchCriteria = {};
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			const matchObject: any = { $match: {} };

			if (searchTerm) {
				// for filtration
				searchCriteria = {
					$match: {
						$or: [
							{ 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
							{ 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
						],
					},
				};
			} else {
				searchCriteria = {
					$match: {
					},
				};
			}

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						sortingType = {
							sale_rent_price: sortType,
						};
						break;

					default:
						sortBy = 'createdAt';
						sortingType = {
							createdAt: sortType,
						};
						break;
				}
			} else {
				sortBy = 'createdAt';
				sortingType = {
					createdAt: sortType,
				};
			}

			if (label && label[0] !== 'all') {
				label.forEach((item) => {
					matchObject.$match['property_basic_details.label'] = item;
				});
			}

			if (bedrooms) { matchObject.$match['property_details.bedrooms'] = bedrooms; }
			if (bathrooms) { matchObject.$match['property_details.bathrooms'] = bathrooms; }
			if (minArea) { matchObject.$match['property_details.floor_area'] = { $gt: minArea }; }
			if (maxArea) { matchObject.$match['property_details.floor_area'] = { $lt: maxArea }; }
			if (minPrice) { matchObject.$match['property_basic_details.sale_rent_price'] = { $gt: minPrice }; }
			if (maxPrice) { matchObject.$match['property_basic_details.sale_rent_price'] = { $lt: maxPrice }; }
			if (propertyId) { matchObject.$match.propertyId = new ObjectId(propertyId); }
			if (propertyType && propertyType !== 3) { matchObject.$match['property_basic_details.status'] = propertyType; }
			if (type && type !== 'all') { matchObject.$match['property_basic_details.type'] = type; }

			// creating the pipeline for mongodb
			const pipeLine = [
				matchObject,
				searchCriteria,
				{
					$sort: sortingType,
				},
			];

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

			const propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
			return propertyData;

		} catch (err) {
			utils.consolelog('error', err, true);
			return Promise.reject(err);
		}
	}
	async userPropertyByStatus(payload, userData) {
		try {

			let { page, limit, sortBy, sortType } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						sortingType = {
							'property_basic_details.sale_rent_price': sortType,
						};
						break;
					case 'date':
						sortBy = 'date';
						sortingType = {
							createdAt: sortType,
						};
						break;
					default:
						sortBy = 'isFeatured';
						sortingType = {
							isFeatured: sortType,
						};
						break;
				}
			} else {
				sortBy = 'isFeatured';
				sortingType = {
					isFeatured: sortType,
					// createdAt:sortType
				};
			}
			const criteria = {
				$match: {
					'userId': userData._id,
					'property_status.number': sortBy,
				},
			};

			const pipeline = [
				criteria,
				{
					$sort: sortingType,
				},
			];

			const data = await ENTITY.PropertyE.PropertyByStatus(pipeline);
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
					//  userTypeNumber:userData.userTypeNumber,
					userTypeString: userData.type,
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

	async updatePropertyStatus(payload: PropertyRequest.UpdatePropertyByAction, userData) {
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
							userTypeNumber: '',
							userTypeString: userData.TYPE,
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
							userTypeNumber: '',
							userTypeString: userData.TYPE,
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

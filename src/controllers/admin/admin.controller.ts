import * as config from 'config';
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
const cert = config.get('jwtSecret');
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminController {

	getTypeAndDisplayName(findObj, num) {
		const obj = findObj;
		const data = Object.values(obj);
		const result = data.filter((x: any) => {
			return x.NUMBER === num;
		});
		return result[0];
	}

	async getProperty(payload, adminData) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
			if (!page) { page = 1; } else { page = page; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			let criteria: object = {};

			if (sortBy) {
				switch (sortBy) {
					case Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER:
						sortBy = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
						sortingType = {
							'property_status.number.Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER': sortType,
						};
						break;
					case Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER:
						sortBy = Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER;
						sortingType = {
							'property_status.number.Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER': sortType,
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

			if (sortBy === 'createdAt') {
				criteria = {
					$match: {
						$or: [{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
						{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER }],
					},
				};
			} else {
				criteria = {
					$match: {
						'property_status.number': sortBy,
					},
				};
			}

			const pipeLine = [
				criteria,
				{ $sort: sortingType },
			];
			const data = await ENTITY.PropertyE.PropertyByStatus(pipeLine);
			return data;

		} catch (error) {
			utils.consolelog(error, 'error', true);
			return Promise.reject(error);
		}
	}

	async getPropertyById(payload: AdminRequest.PropertyDetail) {
		try {
			const criteria = {
				_id: payload.propertyId,
			};
			const getPropertyData = await ENTITY.PropertyE.getOneEntity(criteria, {});
			if (!getPropertyData) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
			}
			return getPropertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async updatePropertyStatus(payload: AdminRequest.UpdatePropertyStatus, adminData) {
		try {
			const criteria = {
				_id: payload.propertyId,
			};
			let result;
			const dataToSet: any = {};

			if (payload.status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER);

				dataToSet.$set = {
					property_status: {
						number: result.NUMBER,
						status: result.TYPE,
						displayName: result.DISPLAY_NAME,
					},
				};
			} else if (payload.status === Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER);
				dataToSet.$set = {
					property_status: {
						number: result.NUMBER,
						status: result.TYPE,
						displayName: result.DISPLAY_NAME,
					},
				};
			}

			// if (payload.status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
			// 	dataToSet.$set = {
			// 		property_status: {
			// 			number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
			// 			status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
			// 			displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME,
			// 		},
			// 	};
			// } else {
			// 	if (payload.status === Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
			// 		dataToSet.$set = {
			// 			property_status: {
			// 				number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
			// 				status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
			// 				displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME,
			// 			},
			// 		};
			// 	}
			// }

			dataToSet.$push = {
				propertyActions: {
					actionNumber: result.NUMBER,
					actionString: result.TYPE,
					actionPerformedBy: {
						userId: adminData._id,
						userTypeNumber: '',
						userTypeString: adminData.TYPE,
					},
					actionTime: new Date().getTime(),
				},
			};
			const updateStatus = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet);
			return updateStatus;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export let AdminService = new AdminController();

import * as config from 'config';
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
const cert = config.get('jwtSecret');
import { Types } from 'mongoose';

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
				{
					$lookup: {
						from: 'regions',
						let: { regionId: '$property_address.region' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$regionId'],
									},
								},
							},
							{
								$project: {
									fullName: 1,
									_id: 1,
								},
							},
						],
						as: 'regionData',
					},
				},
				{
					$lookup: {
						from: 'cities',
						let: { cityId: '$property_address.city' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$cityId'],
									},
								},
							},
							{
								$project: {
									name: 1,
									_id: 1,
								},
							},
						],
						as: 'cityData',
					},
				},
				{
					$unwind: {
						path: '$regionData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						'property_features': 1,
						'updatedAt': 1,
						'createdAt': 1,
						'property_details': 1,
						'property_address.region': '$regionData.fullName',
						'property_address.regionId': '$regionData._id',
						'property_address.city': '$cityData.name',
						'property_address.cityId': '$cityData._id',
						'property_address.address': '$property_address.address',
						'property_address.barangay': '$property_address.barangay',
						'property_address.location': '$property_address.location',
						'propertyId': '$_id',
						'propertyShortId': '$propertyId',
						'property_basic_details': 1,
						'property_added_by': 1,
						'propertyImages': 1,
						'isFeatured': 1,
						'property_status': 1,
					},
				},
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
			const criteria = [
				{
					$match: {
						_id: Types.ObjectId(payload.propertyId),
					},
				},
				{
					$lookup: {
						from: 'regions',
						let: { regionId: '$property_address.region' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$regionId'],
									},
								},
							},
							{
								$project: {
									fullName: 1,
									_id: 1,
								},
							},
						],
						as: 'regionData',
					},
				},
				{
					$lookup: {
						from: 'cities',
						let: { cityId: '$property_address.city' },
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ['$_id', '$$cityId'],
									},
								},
							},
							{
								$project: {
									name: 1,
									_id: 1,
								},
							},
						],
						as: 'cityData',
					},
				},
				{
					$unwind: {
						path: '$regionData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$unwind: {
						path: '$cityData',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						'property_features': 1,
						'updatedAt': 1,
						'createdAt': 1,
						'property_details': 1,
						'property_address.region': '$regionData.fullName',
						'property_address.regionId': '$regionData._id',
						'property_address.city': '$cityData.name',
						'property_address.cityId': '$cityData._id',
						'property_address.address': '$property_address.address',
						'property_address.barangay': '$property_address.barangay',
						'property_address.location': '$property_address.location',
						'propertyId': '$_id',
						'propertyShortId': '$propertyId',
						'property_basic_details': 1,
						'property_added_by': 1,
						'propertyImages': 1,
						'isFeatured': 1,
						'property_status': 1,
					},
				},
			];
			const getPropertyData = await ENTITY.PropertyE.aggregate(criteria, {});
			if (!getPropertyData) {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
			}
			return getPropertyData[0];
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

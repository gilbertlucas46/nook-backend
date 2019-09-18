import { BaseEntity } from './base.entity';
import { Types } from 'mongoose';
import * as Constant from '@src/constants/app.constant';

export class UserPropertyClass extends BaseEntity {
	constructor() {
		super('Property');
	}

	async getUserPropertyList(payload, userData) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const propertyType = payload.propertyType;
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
			} else if (propertyType === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
				sortBy = 'isFeatured';
				sortingType = {
					isFeatured: sortType,
				};
			} else {
				sortBy = 'createdAt';
				sortingType = {
					createdAt: sortType,
				};
			}
			const criteria = {
				$match: {
					'userId': userData._id,
					'property_status.number': propertyType,
				},
			};

			const pipeline = [
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
			const propertyList = await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
			return propertyList;
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
export const UserPropertyE = new UserPropertyClass();

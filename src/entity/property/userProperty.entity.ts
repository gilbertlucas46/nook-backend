import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants/app.constant';
import { PropertyRequest } from '@src/interfaces/property.interface';

export class UserPropertyClass extends BaseEntity {
	constructor() {
		super('Property');
	}
	async getUserPropertyList(payload: PropertyRequest.PropertyByStatus, userData) {
		try {
			let { page, limit, sortBy, sortType } = payload;
			const propertyType = payload.propertyType;
			if (!limit) { limit = Constant.SERVER.LIMIT; }
			if (!page) { page = 1; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			let criteria;
			sortingType = {
				updatedAt: sortType,
			};

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
							updatedAt: sortType,
						};
						break;
					case 'isFeatured':
						sortBy = 'isFeatured';
						sortingType = {
							isFeatured: sortType,
						};
					default:
						sortBy = 'updatedAt';
						sortingType = {
							updatedAt: sortType,
						};
						break;
				}
			}

			if (propertyType === Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER) {
				criteria = {
					$match: {
						userId: userData._id,
						isFeatured: true,
					},
				};
			}
			else if (propertyType !== Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER) {
				criteria = {
					$match: {
						'userId': userData._id,
						'property_status.number': propertyType,
					},
				};
			}

			const pipeline = [
				criteria,
				{
					$project: {
						property_features: 1,
						updatedAt: 1,
						createdAt: 1,
						approvedAt: 1,
						property_details: 1,
						property_address: 1,
						propertyId: '$_id',
						propertyShortId: '$propertyId',
						property_basic_details: 1,
						property_added_by: 1,
						propertyImages: 1,
						isFeatured: 1,
						property_status: 1,
					},
				},
				{ $sort: sortingType },
			];
			return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
export const UserPropertyE = new UserPropertyClass();

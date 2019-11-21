import { BaseEntity } from '@src/entity/base/base.entity';
import { basename } from 'path';
import * as Constant from '@src/constants';
import { SavePropertyRequest } from '@src/interfaces/saveProperty.interface';

export class SavedProperty extends BaseEntity {
    constructor() {
        super('SavedProperty');
    }

    async getList(payload: SavePropertyRequest.SavePropertyList, userData) {
        try {
            let { page, limit, sortType } = payload;
            const { sortBy } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            const skip = (limit * (page - 1));
            sortType = !sortType ? -1 : sortType;
            let sortingType = {};
            const matchObject: any = { $match: { userId: userData['_id'] } };
            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortingType = {
                            price: sortType,
                        };
                        break;
                    case 'date':
                        sortingType = {
                            updatedAt: sortType,
                        };
                        break;
                    case 'isFeatured':
                        sortingType = {
                            isFeatured: sortType,
                        };
                        break;
                }
            } else {
                sortingType = {
                    isFeatured: sortType,
                };
            }
            const query = [
                matchObject,
                { $skip: skip },
                { $limit: limit },
                {
                    $unwind: {
                        path: '$propertyId',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'properties',
                        let: { propertyId: '$propertyId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', '$$propertyId'] },
                                            { $eq: ['$property_status.number', 3] },
                                            // { $eq: ['$property_status.number', 1 || '$property_status.status', 'ACTIVE'] },
                                        ],
                                    },
                                },
                            },
                            { $project: { propertyActions: 0 } },
                        ],
                        as: 'propertyData',
                    },
                },
                {
                    $match: {
                        $expr: { $gt: [{ $size: '$propertyData' }, 0] },
                    },
                },
                {
                    $unwind: {
                        path: '$propertyData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $replaceRoot: { newRoot: '$propertyData' } },
                { $sort: sortingType },
            ];
            const data = await this.DAOManager.paginate(this.modelName, query, limit, page);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const SavedPropertyE = new SavedProperty();
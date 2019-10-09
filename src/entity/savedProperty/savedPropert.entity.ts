import { BaseEntity } from '@src/entity/base/base.entity';
import { basename } from 'path';
import * as Constant from '@src/constants';

export class SavedProperty extends BaseEntity {
    constructor() {
        super('SavedProperty');
    }

    async getList(payload, userData) {
        try {
            let { page, limit, sortType } = payload;
            const { sortBy } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
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
                // {
                //     $unwind: {
                //         path: '$propertyId',
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
                {
                    $lookup: {
                        from: 'property',
                        let: { propertyId: '$propertyId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$propertyId'],
                                    },
                                },
                            },

                        ],
                        as: 'propertyData',
                    },
                },
                {
                    $unwind: {
                        path: '$propertyData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        'property_address.barangay': '$propertyData.property_address.barangay',
                        'createdAt': 1,
                        'property_status.status': '$propertyData.property_status.status',
                    },
                    // _id: 1,
                },
                { $sort: sortingType },

            ];
            const data = await this.DAOManager.paginate(this.modelName, query, limit, page);
            console.log('data>>>>>>>>>>>>>>>>>>>>', data);
            return data;

        } catch (error) {
            console.log('errorerrorerrorerror', error);

            return Promise.reject(error);
        }
    }
}

export const SavedPropertyE = new SavedProperty();
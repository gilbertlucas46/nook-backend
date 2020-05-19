import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';

export class HelpCenterEntity extends BaseEntity {
    constructor() {
        super('HelpCentre');
    }

    async getHelpCenterCategoryBygroup() {
        try {
            const pipeline: any[] = [
                {
                    $group: {
                        _id: '$categoryId',
                        category: {
                            $last: '$categoryType',
                        },
                        title: {
                            $push: {
                                _id: '$_id',
                                title: '$title',
                            },
                        },
                    },
                },
            ];
            return await this.DAOManager.aggregateData(this.modelName, pipeline, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getHelpCenterByCategory(payload) {
        try {
            const { searchTerm, id, type } = payload;
            let query;
            if (searchTerm) {
                query = {
                    // $and:{status:}
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { categoryType: { $regex: searchTerm, $options: 'i' } },
                    ],
                };
            }
            else {
                query = {

                };
            }
            // const d

            const pipeline: any[] = [
                {
                    $match: {
                        categoryId: id,
                        type,
                        $or: [
                            query,
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                    },
                },
            ];
            return await this.DAOManager.aggregateData(this.modelName, pipeline, {});
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let HelpCenterE = new HelpCenterEntity();
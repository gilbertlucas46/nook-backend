import { BaseEntity } from '@src/entity/base/base.entity';

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
            const result = await this.DAOManager.aggregateData(this.modelName, pipeline, {});
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getHelpCenterByCategory(id: number) {
        try {
            const pipeline: any[] = [
                {
                    $match: {
                        categoryId: id,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                    },
                },
            ];
            const result = await this.DAOManager.aggregateData(this.modelName, pipeline, {});
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export let HelpCenterE = new HelpCenterEntity();
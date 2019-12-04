'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
export class SubscriptionClass extends BaseEntity {

    constructor() {
        super('AdminSubscription');
    }

    async adminSubscription() {
        try {
            // featuredType: string;
            // subscriptionType: string;
            // amount: number;
            // description: string;

            const pipeline: any[] = [{
                $group: {
                    _id: '$featuredType',
                    data: {
                        $push: {
                            _id: '$_id',
                            amount: '$amount',
                            description: '$description',
                            featuredType: '$featuredType',
                        },
                    },
                },
            },
            { $unwind: '$data' },
            { $project: { _id: 0 } },
            ];
            return await this.DAOManager.aggregateData('AdminSubscription', pipeline, {});
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const AdminSubscriptionService = new SubscriptionClass();
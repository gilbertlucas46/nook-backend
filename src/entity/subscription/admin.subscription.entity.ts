'use strict';

import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { SubscriptionRequest } from '@src/interfaces/subscription.interface';

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
            console.log('pipelinepipelinepipelinepipeline', JSON.stringify(pipeline))
            const data = await this.DAOManager.aggregateData('AdminSubscription', pipeline, {});
            // const data = ENTITY.AdminE.aggregate('AdminSubscription', pipeline);
            console.log('data>>>>>>>>>>>>>>>>>>>>>>', data);
            return data;

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const AdminSubscriptionService = new SubscriptionClass();
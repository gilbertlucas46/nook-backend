import * as cron from 'node-cron';
import { PropertyE } from '../entity';
import * as ENTITY from '../entity';
import * as Constant from '../constants';

import { BaseEntity } from '@src/entity/base/base.entity';

export let job1 = cron.schedule('0 */1 * * * *', () => {
    // this.updateProperty();
    // ExpireServices.updateProperty();
});

class ExpireE extends BaseEntity {
    constructor() {
        super('Property');
    }
    async updateProperty() {
        try {
            const compareTime = new Date().setFullYear(new Date().getFullYear() - 1); // 1 year a
            const compare = new Date();
            compare.setFullYear(compare.getFullYear() + 1);
            const expireCriteria = {
                //  updated at aaj ke ek saaal se jyada nhi hna chahiye
                updatedAt: { $lt: compareTime },   // 31556926 are 1 year second
            };
            const data = await ENTITY.PropertyE.count(expireCriteria);
            console.log('datadatadatadata', data);
            const dataToUpdate = {
                property_status: {
                    number: Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
                    status: Constant.DATABASE.PROPERTY_STATUS.EXPIRED.TYPE,
                    displayName: Constant.DATABASE.PROPERTY_STATUS.EXPIRED.DISPLAY_NAME,
                },
            };


            // const dataq = await ENTITY.PropertyE.updateMultiple(expireCriteria, dataToUpdate);
            // console.log('expireCriteriaexpireCriteriaexpireCriteria', dataq);
            // job.start();
            return;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async updateSubscription() {
        try {
            // db.getCollection('subscriptions').find({status:'active', endDate:{ $gt :new Date().getTime() } ,$or:[{featuredType:"HOMEPAGE_PROFILE"} ,{featuredType:"PROFILE"}]});

            const ExpiredSubscriptionCriteria = {
                status: Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE,
                $or: [{
                    featuredType: Constant.DATABASE.FEATURED_TYPE.HOMEPAGE_PROFILE,
                }, {
                    featuredType: Constant.DATABASE.FEATURED_TYPE.PROFILE,
                }],
                endDate: { $lt: new Date().getTime() },
                isRecurring: false,
            };

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ExpireServices = new ExpireE();
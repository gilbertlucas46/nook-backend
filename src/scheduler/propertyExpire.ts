import * as cron from 'node-cron';
import { PropertyE } from '../entity';
import * as ENTITY from '../entity';
import * as Constant from '../constants';

import { BaseEntity } from '@src/entity/base/base.entity';

let job1 = cron.schedule('0 */1 * * * *', () => {
    this.updateProperty();
});


class ExpireE extends BaseEntity {
    constructor() {
        super('Property');
    }
    async updateProperty() {
        try {
            const compareTime = new Date().setFullYear(new Date().getFullYear() - 1); // 1 year a
            const compare = new Date().getTime() - 5 * 24 * 60 * 60 * 1000;
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
}

export const ExpireServices = new ExpireE();
'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import { SubscriptionPlan, ISubscriptionPlan } from '@src/models/subscription';
import { PLANS } from '@src/constants/subscription.plan.constant';
export class SubscriptionClass extends BaseEntity {

    constructor() {
        super('AdminSubscription');
    }

    async adminSubscription() {
        try {
            return await this.DAOManager.getData('AdminSubscription', {}, {}, {});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description A function to insert multiple documents into collection.
     * @param data entity info
     */
    async store(payload: ISubscriptionPlan[]): Promise<SubscriptionPlan[]> {
        return await this.DAOManager.store<SubscriptionPlan>('AdminSubscription', payload);
    }

    async isEmpty(): Promise<boolean> {
        return !await this.DAOManager.count(this.modelName, {});
    }
    async bootstrap() {
        if (await this.isEmpty()) {
            const planData: any = PLANS;
            await this.store(planData);
        }
    }

    async clear() {
        await this.DAOManager.remove(this.modelName, {});
    }
}

export const SubscriptionPlanEntity = new SubscriptionClass();
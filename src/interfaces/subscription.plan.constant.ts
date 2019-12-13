import { Types, Document } from 'mongoose';
export namespace Subscription {

    export interface SubscriptionPlan {
        featuredType: string;
        description: string;
    }

    export interface Plan1 {
        billingType: string;
        amount: number;
    }

    export interface Plan extends SubscriptionPlan {
        plans: Plan1[];
    }

    export interface IAdminSubscription extends Document, SubscriptionPlan {
        createdAt?: number;
        updatedAt?: number;
    }

}

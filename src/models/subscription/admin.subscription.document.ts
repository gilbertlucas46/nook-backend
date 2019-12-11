import { Schema, Document, Types, model } from 'mongoose';

export interface Plan {
    billingType: string;
    amount: number;
}
export interface ISubscriptionPlan {
    featuredType: string;
    plans: Plan[];
    description: string;
}

export interface SubscriptionPlan extends Document, ISubscriptionPlan {
    createdAt?: number;
    updatedAt?: number;
}

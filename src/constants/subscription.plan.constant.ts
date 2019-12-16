import { Subscription } from '../interfaces/subscription.plan.constant';

export const PLANS: Subscription.Plan[] = [{
    featuredType: 'HOMEPAGE',
    plans: [
        {
            billingType: 'YEARLY',
            amount: 1000,
        },
        {
            billingType: 'MONTHLY',
            amount: 2000,
        },
    ],
    description: 'HOMEPAGE',
},
{
    featuredType: 'FREE',
    plans: [
        {
            billingType: 'YEARLY',
            amount: 0,
        },
        {
            billingType: 'MONTHLY',
            amount: 0,
        },
    ],
    description: 'FREE',
},
{
    featuredType: 'PROFILE',
    plans: [
        {
            billingType: 'YEARLY',
            amount: 12120,
        },
        {
            billingType: 'MONTHLY',
            amount: 2120,
        },
    ],
    description: 'PROFILE',
},
{
    featuredType: 'PROPERTY',
    plans: [
        {
            billingType: 'YEARLY',
            amount: 12344,
        },
        {
            billingType: 'MONTHLY',
            amount: 1234,
        },
    ],
    description: 'PROPERTY',
},
];
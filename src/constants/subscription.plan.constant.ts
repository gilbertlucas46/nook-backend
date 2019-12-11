import { Subscription } from '../interfaces/subscription.plan.constant';

export const PLANS: Subscription.Plan[] = [{  // Subscription.AdminSubscription
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
    description: 'cdercrefcerfdre',
    // createdAt: 1575453444343.0,
    // updatedAt: 1575453444343.0,
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
    description: 'cdercrefcerfdre',
    // createdAt: 1575453515172.0,
    // updatedAt: 1575453515172.0
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
    description: 'cdercrefcerfdre',
    // createdAt: 1575453565647.0,
    // updatedAt: 1575453565647.0
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
    description: 'cdercrefcerfdre',
    // createdAt: 1575453585839.0,
    // updatedAt: 1575453585839.0
},
];
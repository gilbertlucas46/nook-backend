export namespace SubscriptionRequest {

    export interface Get {
        featuredType?: string;
        userId: string;
    }

    export interface Add {
        featuredType: string;
        userId: string;
        subscriptionType: string;
    }
}
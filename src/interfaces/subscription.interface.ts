export namespace SubscriptionRequest {

    export interface Get {
        featuredType: string;
        userId: string;
        propertyId?: boolean;
    }

    export interface Add {
        featuredType: string;
        userId: string;
        subscriptionType: string;
    }
}
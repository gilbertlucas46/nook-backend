import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants';
import * as Stripe from 'stripe';

const stripe = new Stripe('sk_test_bczq2IIJNuLftIaA79Al1wrx00jgNAsPiU');

export class PaymentClass extends BaseEntity {
    constructor() {
        super('Payment');
    }

    async cardInfo(payload, cusData): Promise<any> {
        try {
            const cardInfo = await stripe.tokens.retrieve(payload.cardToken);
            const isAnyMatched: boolean = cusData.cardDetail.some((doc): boolean => {
                return doc.fingerprint === cardInfo['card']['fingerprint'];
            });
            if (isAnyMatched) return isAnyMatched;
            else return cardInfo;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const PaymentE = new PaymentClass();
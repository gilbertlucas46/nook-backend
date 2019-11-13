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
            console.log('cusDatacusDatacusDatacusDatacusDatacusData', cusData);

            const cardInfo = await stripe.tokens.retrieve(payload.cardToken);
            console.log('cardInfocardInfocardInfo', cardInfo);
            const isAnyMatched: boolean = cusData.cardDetail.some((doc): boolean => {
                console.log('docdocdocdocdoc', doc);
                return doc.fingerprint === cardInfo['card']['fingerprint'];
            });
            // data['fingerPrint'] =  ;
            console.log('isAnyMatchedisAnyMatched/isAnyMatched', isAnyMatched);

            // return isAnyMatched;
            if (isAnyMatched) {
                return isAnyMatched;
            } else {
                return cardInfo;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const PaymentE = new PaymentClass();
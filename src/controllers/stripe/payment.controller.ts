import * as ENTITY from '@src/entity';
import { BaseEntity } from '@src/entity/base/base.entity';
import * as Contsant from '@src/constants/app.constant';
import * as Stripe from 'stripe';

const stripe = new Stripe('sk_test_bczq2IIJNuLftIaA79Al1wrx00jgNAsPiU');

class PaymentController extends BaseEntity {

    async checkCustomer(payload, userData) {
        try {
            const data = await ENTITY.PaymentE.getOneEntity({ userId: userData._id }, { stripeCustomerId: 1 });
            if (data) {
                return data;
            } else {
                const customer = await stripe.customers.create({ description: userData.userName });
                const dataToSave = {
                    userId: userData._id,
                    stripeCustomerId: customer.id,
                };
                const data1 = await ENTITY.PaymentE.createOneEntity(dataToSave);
                return data1;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async addCustomerCard(payload: any, userData) {
        try {
            // await stripe.customers.createSource(userData.stripeCustomerId, { source: payload.source });
            const addCard: any = {};
            const cusData: any = await ENTITY.PaymentE.getOneEntity({ userId: userData._id }, {});

            if (!cusData) {
                const customer = await stripe.customers.create({ description: userData.userName });

                const addCard1 = await stripe.customers.createSource(customer.id, { source: payload.cardToken });
                const createData = {
                    userId: userData._id,
                    stripeCustomerId: customer.id,
                    // cardDetails: [{
                    //     cardNumber: { type: Number },
                    //     cvvNumber: { type: Number },
                    //     expiryDate:{}
                    // }]
                    // fingerPrint: { type: String },
                    cardDetail: [addCard1],
                };

                const userCard = await ENTITY.PaymentE.createOneEntity(createData);
                return userCard;
            } else {
                const dataToUpdate: any = {};
                // get the info of the card
                const cardInfo = await ENTITY.PaymentE.cardInfo(payload, cusData);
                if (cardInfo === true) {
                    return Promise.reject('Already card added');
                } else {
                    const criteria1 = {
                        userId: userData._id,
                    };
                    cardInfo.createdAt = new Date();
                    // dataToUpdate.$ = {};
                    dataToUpdate.$push = {
                        cardDetail: cardInfo,
                    };
                    const aaa = await ENTITY.PaymentE.updateOneEntity(criteria1, dataToUpdate);
                    const addCard1 = await stripe.customers.createSource(cusData.stripeCustomerId, { source: payload.cardToken });
                    return {};
                }
            }
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteCard(payload, userData) {
        try {
            const criteria = {
                userId: userData._id,
            };
            const userCards = await ENTITY.PaymentE.getOneEntity(criteria, {});
            const data = await stripe.customers.deleteSource(userCards.stripeCustomerId, payload.cardToken);
            // asynchronously called
            return data;
        } catch (error) {

            return Promise.reject(error);
        }
    }

    async createCharge(payload, userData) {
        try {
            const charge = await stripe.charges.create(
                {
                    amount: payload.amount,
                    currency: payload.currency,
                    source: payload.source,
                    description: payload.description,
                });
            if (charge) {
                const data = await ENTITY.TransactionE.createOneEntity(charge);
            }

            return charge;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const stripeController = new PaymentController();
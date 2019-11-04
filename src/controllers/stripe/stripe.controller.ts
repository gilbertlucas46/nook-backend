import * as ENTITY from '@src/entity';
import { Types } from 'mongoose';
import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanEntity } from '@src/entity/loan/loan.entity';
import * as Contsant from '@src/constants/app.constant';
import { LoanRequest } from '@src/interfaces/loan.interface';
import { constants } from 'fs';
const stripe = require('stripe')('sk_test_bczq2IIJNuLftIaA79Al1wrx00jgNAsPiU');

// import { DAOManager } from '@src/databases/dao';

class PaymentController extends BaseEntity {

    async addPayment(payload: any) {
        try {
            const stripeOrder = await stripe.orders.create(payload);
            console.log(`Order created: ${stripeOrder.id}`);
            const bankData = await ENTITY.LoanEntity.createOneEntity(payload);

            return;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const stripeController = new PaymentController();
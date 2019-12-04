'use strict';
import { BaseEntity } from '@src/entity/base/base.entity';
import * as utils from '@src/utils';
import { WebhookRequest } from '@src/interfaces/webhook.interface';

export class WebhookClass extends BaseEntity {

    constructor() {
        super('Webhook');
    }

    async addWebhook(payload: WebhookRequest.Add) {
        try {
            return await this.DAOManager.saveData(this.modelName, payload);
        } catch (error) {
            utils.consolelog('Error', error, true);
            return Promise.reject(error);
        }
    }
}

export const WebhookE = new WebhookClass();
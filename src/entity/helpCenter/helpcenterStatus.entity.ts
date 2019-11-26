import { BaseEntity } from '@src/entity/base/base.entity';

class HelpfulHelpCentre extends BaseEntity {
    constructor() {
        super('HelpfulHelCenter');
    }
    async createhelpfulStatus(payload) {
        try {
            const criteria = { ipAddress: payload.ipAddress };
            payload['createdAt'] = new Date().getTime();
            payload['updatedAt'] = new Date().getTime();
            return await this.DAOManager.findAndUpdate('HelpCenterStatus', criteria, payload, { new: true, upsert: true, lean: true });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const HelpfulE = new HelpfulHelpCentre();
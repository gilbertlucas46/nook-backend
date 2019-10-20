import { BaseEntity } from '@src/entity/base/base.entity';

class HelpfulHelpCentre extends BaseEntity {
    constructor() {
        super('HelpfulHelCenter');
    }
    async createhelpfulStatus(payload) {
        try {
            console.log('payload', payload);

            const criteria = {
                ipAddress: payload.ipAddress,
            };

            let data;
            payload['createdAt'] = new Date().getTime();
            payload['updatedAt'] = new Date().getTime();

            if (payload.isHelpful) {
                console.log('payload>>>>>>>>>>>>>>>>>>>>>>>>', payload);
                data = await this.DAOManager.findAndUpdate('HelpCenterStatus', criteria, payload, { new: true, upsert: true, lean: true });
                console.log('datadatadatadatadatadatadata', data);

                return data;
            }
            else {
                console.log('payload>>>>>>>>>>>>>>>>>>>>>>>>11111111111111111111', payload);
                data = await this.DAOManager.findAndUpdate('HelpCenterStatus', criteria, payload, { new: true, upsert: true, lean: true });
                return data;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const HelpfulE = new HelpfulHelpCentre();
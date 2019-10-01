import { BaseEntity } from '@src/entity/base/base.entity';
import { AgentRequest } from '@src/interfaces/agent.interface';
import { SERVER } from '@src/constants/app.constant';
import { Types } from 'mongoose';

export class AgentClass extends BaseEntity {
    constructor() {
        super('User');
    }
    async getAgent(payload: AgentRequest.SearchAgent) {
        try {
            let { page, limit, sortType } = payload;
            const { fromDate, toDate, cityId } = payload;
            if (!limit) { limit = SERVER.LIMIT; } else { limit = limit; }
            if (!page) { page = 1; } else { page = page; }
            sortType = !sortType ? -1 : sortType;
            const matchObject: any = { $match: { type: 'AGENT' } };

            if (cityId) { matchObject.$match._id = Types.ObjectId(cityId); }
            // Date filters
            if (fromDate && toDate) { matchObject.$match['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchObject.$match['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchObject.$match['createdAt'] = { $lte: toDate }; }

            const query = [
                matchObject,
                {
                    $project: {
                        firstName: 1,
                        userName: 1,
                        email: 1,
                        password: 1,
                        middleName: 1,
                        lastName: 1,
                        phoneNumber: 1,
                        type: 1,
                        title: 1,
                        license: 1,
                        taxNumber: 1,
                        faxNumber: 1,
                        companyName: 1,
                        address: 1,
                        aboutMe: 1,
                        profilePicUrl: 1,
                        backGroundImageUrl: 1,
                        specializingIn_property_type: 1,
                        specializingIn_property_category: 1,
                        serviceAreas: 1,
                    },
                },
            ];
            const agentList = await this.DAOManager.paginate(this.modelName, query, limit, page);
            return agentList;

        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export let AgentE = new AgentClass();
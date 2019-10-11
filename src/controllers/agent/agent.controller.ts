
import { AgentE } from '@src/entity';
import * as utils from '@src/utils';
import { AgentRequest } from '@src/interfaces/agent.interface';

export class AgentController {

	async searchAgent(payload: AgentRequest.SearchAgent) {
		try {
			const propertyData = await AgentE.getAgent(payload);
			return propertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	// async agentProperty(payload: AgentRequest.UserProperty) {
	// 	try {
	// 		const data = await AgentE.getAgentProperty(payload);
	// 		return data;
	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	}
	// }
}
export let AgentService = new AgentController();

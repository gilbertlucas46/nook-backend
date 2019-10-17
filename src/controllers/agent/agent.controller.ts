
import { AgentE } from '@src/entity';
import * as utils from '@src/utils';
import { AgentRequest } from '@src/interfaces/agent.interface';

export class AgentController {
/**
 *
 * @param payload category by and specialisation by agents
 */
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
/**
 *
 * @param agent detail via userName
 */

 async agentInfo(userName: string) {
		try {
			const data = await AgentE.getAgentInfo(userName);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
export let AgentService = new AgentController();

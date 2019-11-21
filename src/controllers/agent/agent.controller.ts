
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
			return await AgentE.getAgent(payload);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	/**
	 * @description Function for getting agent profile details.
	 * @param userName
	 */
	async agentInfo(userName: string) {
		try {
			return await AgentE.getAgentInfo(userName);
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
export let AgentService = new AgentController();

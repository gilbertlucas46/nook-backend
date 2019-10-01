
import * as ENTITY from '@src/entity';
import * as utils from '@src/utils';
import { AgentRequest } from '@src/interfaces/agent.interface';

export class AgentController {

	async searchAgent(payload: AgentRequest.SearchAgent) {
		try {
			// const propertyData = await ENTITY.PropertyE.getPropertyList(payload);
			// return propertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}
export let AgentService = new AgentController();

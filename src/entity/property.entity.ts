import { BaseEntity } from './base.entity'
export class PropertyClass extends BaseEntity {
	constructor() {
		super('Property')
	}

	async PropertyList(pipeline) {
		try {
			const propertyList = await this.DAOManager.paginate(this.modelName, pipeline);
			return propertyList;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async PropertyByStatus(query) {
		try {
			const data = await this.DAOManager.paginate(this.modelName, query);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const PropertyE = new PropertyClass()

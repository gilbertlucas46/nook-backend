'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("./base.entity");
class PropertyClass extends base_entity_1.BaseEntity {
    constructor() {
        super('Property');
    }
    async PropertyList(pipeline) {
        try {
            let propertyList = await this.DAOManager.paginate(this.modelName, pipeline);
            return propertyList;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async ProprtyByStatus(query) {
        try {
            let data = await this.DAOManager.paginate(this.modelName, query);
            return data;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
exports.PropertyClass = PropertyClass;
exports.PropertyE = new PropertyClass();
//# sourceMappingURL=property.entity.js.map
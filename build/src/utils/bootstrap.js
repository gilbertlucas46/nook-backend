"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const databases_1 = require("../databases");
const entity_1 = require("./../entity");
const displayColors = config.get('displayColors');
class Bootstrap {
    constructor() {
        this.dataBaseService = new databases_1.Database();
    }
    async bootstrap(server) {
        try {
            await this.dataBaseService.connectDatabase();
            await this.initRegions();
            entity_1.AdminE.adminAccountCreator();
        }
        catch (error) {
            console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', error.toString());
        }
        return;
    }
    async initRegions() {
        setTimeout(() => {
            console.log('Region Initiated');
        }, 5000);
    }
}
exports.Bootstrap = Bootstrap;
//# sourceMappingURL=bootstrap.js.map
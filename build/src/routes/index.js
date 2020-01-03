"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = require("./user/user.routes");
const property_routes_1 = require("./property/property.routes");
const admin_routes_1 = require("./admin/admin.routes");
exports.Routes = [];
exports.Routes = exports.Routes.concat(user_routes_1.userRoute, property_routes_1.propertyRoute, admin_routes_1.adminProfileRoute);
//# sourceMappingURL=index.js.map
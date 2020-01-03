'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const authtoken = require("./auth-token");
const swagger = require("./swagger");
const good = require("./good");
exports.plugins = [].concat(authtoken, swagger, good);
//# sourceMappingURL=index.js.map
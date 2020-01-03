'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AuthBearer = require("hapi-auth-bearer-token");
const lib_1 = require("../lib");
const UniversalFunctions = require("../utils");
const Constant = require("../constants");
exports.plugin = {
    name: "auth-token-plugin",
    register: async function (server) {
        await server.register(AuthBearer);
        server.auth.strategy('AdminAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                let tokenData = await lib_1.verifyAdminToken(token, 'ADMIN');
                if (!tokenData || !tokenData['adminData']) {
                    return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED));
                }
                else {
                    return ({ isValid: true, credentials: { token: token, adminData: tokenData['adminData'] } });
                }
            }
        });
        server.auth.strategy('UserAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                let tokenData = await lib_1.verifyToken(token, 'USER', request);
                if (!tokenData || !tokenData['userData']) {
                    return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.TOKEN_ALREADY_EXPIRED));
                }
                else {
                    if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.BLOCKED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED));
                    }
                    else if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.DELETED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED));
                    }
                    else {
                        return ({ isValid: true, credentials: { token: token, userData: tokenData['userData'] } });
                    }
                }
            }
        });
        server.auth.strategy('GuestAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                let tokenData = await lib_1.verifyToken(token, 'GUEST');
                if (!tokenData || !tokenData['userData']) {
                    return ({ isValid: true, credentials: { token: token, userData: {} } });
                }
                else {
                    return ({ isValid: true, credentials: { token: token, userData: {} } });
                }
            }
        });
        server.auth.strategy('BasicAuth', 'bearer-access-token', {
            tokenType: "Basic",
            validate: async (request, token, h) => {
                let checkApiKeyFunction = await apiKeyFunction(request.headers.api_key);
                if (!checkApiKeyFunction) {
                    return ({ isValid: false, credentials: { token: token, userData: {} } });
                }
                else {
                    let checkFunction = await basicAuthFunction(token);
                    if (!checkFunction) {
                        return ({ isValid: false, credentials: { token: token, userData: {} } });
                    }
                    return ({ isValid: true, credentials: { token: token, userData: {} } });
                }
            }
        });
    }
};
let apiKeyFunction = async function (api_key) {
    return (api_key === "1234") ? true : false;
};
let basicAuthFunction = async function (access_token) {
    const credentials = Buffer.from(access_token, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username !== password)
        return false;
    return true;
};
//# sourceMappingURL=auth-token.js.map
'use strict';

import * as AuthBearer from 'hapi-auth-bearer-token';
import { verifyToken } from '../lib';
import * as  UniversalFunctions from '../utils';
import * as Constant from '../constants';


//Register Authorization Plugin
export let plugin = {
    name: "auth-token-plugin",
    register: async function (server) {

        await server.register(AuthBearer);
        server.auth.strategy('AdminAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                console.log("ADMIN      ", token)
                let tokenData = await verifyToken(token, 'ADMIN')
                if (!tokenData || !tokenData['userData']) {
                    return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED))
                } else {
                    if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.BLOCKED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED));
                    } else if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.DELETED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED));
                    } else {
                        return ({ isValid: true, credentials: { token: token, userData: tokenData['userData'] } })
                    }
                }
            }
        });

        server.auth.strategy('UserAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                // let checkApiKeyFunction = await apiKeyFunction(request.headers.api_key)
                // if (!checkApiKeyFunction) {
                //     return ({ isValid: false, credentials: { token: token, userData: {} } })
                // } else {
                let tokenData = await verifyToken(token, 'TENANT');
                console.log("TENANT     ", token)
                if (!tokenData || !tokenData['userData']) {
                    return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.TOKEN_ALREADY_EXPIRED))
                } else {
                    if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.BLOCKED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED));
                    } else if (tokenData['userData']['status'] === Constant.DATABASE.STATUS.USER.DELETED) {
                        return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED));
                    } else {
                        return ({ isValid: true, credentials: { token: token, userData: tokenData['userData'] } })
                    }
                }
                // }
            }
        });

        server.auth.strategy('GuestAuth', 'bearer-access-token', {
            allowQueryToken: false,
            allowMultipleHeaders: true,
            accessTokenName: 'accessToken',
            validate: async (request, token, h) => {
                console.log("GUEST      ", token)
                let tokenData = await verifyToken(token, 'GUEST')
                if (!tokenData || !tokenData['userData']) {
                    return ({ isValid: true, credentials: { token: token, userData: {} } })
                } else {
                    return ({ isValid: true, credentials: { token: token, userData: {} } })
                }
            }
        });

        server.auth.strategy('BasicAuth', 'bearer-access-token', {
            tokenType: "Basic",
            validate: async (request, token, h) => {
                let checkApiKeyFunction = await apiKeyFunction(request.headers.api_key)
                if (!checkApiKeyFunction) {
                    return ({ isValid: false, credentials: { token: token, userData: {} } })

                } else {
                    // validate user and pswd here
                    let checkFunction = await basicAuthFunction(token)
                    if (!checkFunction) {
                        return ({ isValid: false, credentials: { token: token, userData: {} } })
                    }
                    return ({ isValid: true, credentials: { token: token, userData: {} } })
                }
            }
        });
    }
};


let apiKeyFunction = async function (api_key) {
    // console.log("apiKey.........", api_key)
    return (api_key === "1234") ? true : false
}

let basicAuthFunction = async function (access_token) {
    // console.log("access_token.........", access_token)

    const credentials = Buffer.from(access_token, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // console.log("credentials.........", credentials)
    if (username !== password) {
        return false;
    }
    return true
}
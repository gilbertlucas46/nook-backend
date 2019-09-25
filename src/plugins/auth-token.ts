// import * as AuthBearer from 'hapi-auth-bearer-token';
// import { verifyToken, verifyAdminToken } from '../lib';
// import * as  UniversalFunctions from '../utils';
// import * as Constant from '../constants';

// // Register Authorization Plugin
// export let plugin = {
// 	name: 'auth-token-plugin',
// 	async register(server) {

// 		await server.register(AuthBearer);
// 		server.auth.strategy('AdminAuth', 'bearer-access-token', {
// 			allowQueryToken: false,
// 			allowMultipleHeaders: true,
// 			accessTokenName: 'accessToken',
// 			validate: async (request, token, h) => {
// 				const tokenData = await verifyAdminToken(token, 'ADMIN');
// 				if (!tokenData || !tokenData.adminData) {
// 					return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED));
// 				} else {
// 					return ({ isValid: true, credentials: { token, adminData: tokenData.adminData } });
// 				}
// 			},
// 		});

// 		server.auth.strategy('UserAuth', 'bearer-access-token', {
// 			allowQueryToken: false,
// 			allowMultipleHeaders: true,
// 			accessTokenName: 'accessToken',
// 			validate: async (request, token, h) => {
// 				// let checkApiKeyFunction = await apiKeyFunction(request.headers.api_key)
// 				// if (!checkApiKeyFunction) {
// 				//     return ({ isValid: false, credentials: { token: token, userData: {} } })
// 				// } else {
// 				const tokenData = await verifyToken(token, 'USER', request);
// 				if (!tokenData || !tokenData.userData) {
// 					return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.TOKEN_ALREADY_EXPIRED));
// 				} else {
// 					if (tokenData.userData.status === Constant.DATABASE.STATUS.USER.BLOCKED) {
// 						return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED));
// 					} else if (tokenData.userData.status === Constant.DATABASE.STATUS.USER.DELETED) {
// 						return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED));
// 					} else {
// 						return ({ isValid: true, credentials: { token, userData: tokenData.userData } });
// 					}
// 				}
// 				// }
// 			},
// 		});

// 		server.auth.strategy('GuestAuth', 'bearer-access-token', {
// 			allowQueryToken: false,
// 			allowMultipleHeaders: true,
// 			accessTokenName: 'accessToken',
// 			validate: async (request, token, h) => {
// 				const tokenData = await verifyToken(token, 'GUEST');
// 				if (!tokenData || !tokenData.userData) {
// 					return ({ isValid: true, credentials: { token, userData: {} } });
// 				} else {
// 					return ({ isValid: true, credentials: { token, userData: {} } });
// 				}
// 			},
// 		});

// 		server.auth.strategy('BasicAuth', 'bearer-access-token', {
// 			tokenType: 'Basic',
// 			validate: async (request, token, h) => {
// 				const checkApiKeyFunction = await apiKeyFunction(request.headers.api_key);
// 				if (!checkApiKeyFunction) {
// 					return ({ isValid: false, credentials: { token, userData: {} } });

// 				} else {
// 					// validate user and pwd here
// 					const checkFunction = await basicAuthFunction(token);
// 					if (!checkFunction) {
// 						return ({ isValid: false, credentials: { token, userData: {} } });
// 					}
// 					return ({ isValid: true, credentials: { token, userData: {} } });
// 				}
// 			},
// 		});
// 	},
// };

// const apiKeyFunction = async (apiKey: string) => {
// 	return (apiKey === '1234') ? true : false;
// };

// const basicAuthFunction = async (accessToken: string) => {
// 	const credentials = Buffer.from(accessToken, 'base64').toString('ascii');
// 	const [username, password] = credentials.split(':');
// 	if (username !== password) { return false; }
// 	return true;
// };

import * as AuthBearer from 'hapi-auth-bearer-token';
import { verifyToken, verifyAdminToken } from '../lib';
import * as  UniversalFunctions from '../utils';
import * as Constant from '../constants';

// Register Authorization Plugin
export let plugin = {
	name: 'auth-token-plugin',
	async register(server) {

		await server.register(AuthBearer);
		server.auth.strategy('AdminAuth', 'bearer-access-token', {
			allowQueryToken: false,
			allowMultipleHeaders: true,
			accessTokenName: 'accessToken',
			validate: async (request, token, h) => {
				const tokenData = await verifyAdminToken(token, 'ADMIN');

				if (!tokenData || !tokenData.adminData) {
					return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED));
				} else {
					return ({ isValid: true, credentials: { token, adminData: tokenData.adminData } });
				}
			},
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
				const tokenData = await verifyToken(token, 'USER', request);
				if (!tokenData || !tokenData.userData) {
					return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.TOKEN_ALREADY_EXPIRED));
				} else {
					if (tokenData.userData.status === Constant.DATABASE.STATUS.USER.BLOCKED) {
						return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_BLOCKED));
					} else if (tokenData.userData.status === Constant.DATABASE.STATUS.USER.DELETED) {
						return Promise.reject(UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.ADMIN_DELETED));
					} else {
						return ({ isValid: true, credentials: { token, userData: tokenData.userData } });
					}
				}
				// }
			},
		});

		server.auth.strategy('GuestAuth', 'bearer-access-token', {
			allowQueryToken: false,
			allowMultipleHeaders: true,
			accessTokenName: 'accessToken',
			validate: async (request, token, h) => {
				const tokenData = await verifyToken(token, 'GUEST');
				if (!tokenData || !tokenData.userData) {
					return ({ isValid: true, credentials: { token, userData: {} } });
				} else {
					return ({ isValid: true, credentials: { token, userData: {} } });
				}
			},
		});

		server.auth.strategy('BasicAuth', 'bearer-access-token', {
			tokenType: 'Basic',
			validate: async (request, token, h) => {
				const checkApiKeyFunction = await apiKeyFunction(request.headers.api_key);
				if (!checkApiKeyFunction) {
					return ({ isValid: false, credentials: { token, userData: {} } });

				} else {
					// validate user and pwd here
					const checkFunction = await basicAuthFunction(token);
					if (!checkFunction) {
						return ({ isValid: false, credentials: { token, userData: {} } });
					}
					return ({ isValid: true, credentials: { token, userData: {} } });
				}
			},
		});
	},
};

const apiKeyFunction = async (apiKey: string) => {
	return (apiKey === '1234') ? true : false;
};

const basicAuthFunction = async (accessToken: string) => {
	const credentials = Buffer.from(accessToken, 'base64').toString('ascii');
	const [username, password] = credentials.split(':');
	if (username !== password) { return false; }
	return true;
};

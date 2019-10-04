import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import { HelpCenterService } from '@src/controllers/helpCenter/helpCenter.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';
export let helpCenterRoute: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/help-center',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any)['adminData'];
                const payload: helpCenterRequest.CreateHelpCenter = request.payload as any;
                const data = await HelpCenterService.createHelpCenter(payload);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS, data);
            } catch (error) {
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'update account type ',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    title: Joi.string(),
                    videoUrl: Joi.string(),
                    description: Joi.string(),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
];
import * as utils from '@src/utils/index';
import { ArticleRequest } from '@src/interfaces/article.interface';
import { UserRequest } from '@src/interfaces/user.interface';

import * as ENTITY from '../../entity';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class ArticleController {
    async createArticle(payload: ArticleRequest.CreateArticle, userData) {
        try {
            console.log('userData.type=------------------', userData.type);
            const uploadBy = {};
            const dataToSet: any = {};
            // payload.uploadBy.userId = userData._id;
            if (true) {
                uploadBy['type'] = userData.type;
                uploadBy['name'] = userData.name;
                uploadBy['userId'] = userData._id;
            }
            payload['userId'] = userData._id;
            // console.log('uploadBy-===========', uploadBy);
            // console.log('payload================>', typeof payload.uploadBy, typeof payload.uploadBy.name, typeof payload.uploadBy.type, typeof payload.uploadBy.userId);
            const articleData = await ENTITY.ArticleE.createOneEntity(payload);
            console.log('articleData', articleData);
            return articleData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);

        }
    }
}

export const ArticleService = new ArticleController();

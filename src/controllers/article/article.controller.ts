import * as Constant from '@src/constants/app.constant';
import * as utils from '@src/utils/index';
import { ArticleRequest } from '@src/interfaces/article.interface';
import * as ENTITY from '../../entity';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class ArticleController {
    constructor() { }
    async createArticle(payload: ArticleRequest.CreateArticle, userData) {
        try {
            payload.uploadBy.type = userData.type;
            payload.uploadBy.name = userData.name;
            payload.uploadBy.userId = userData._id;
            payload.userId = userData._id;


            console.log('payload================>', payload);

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

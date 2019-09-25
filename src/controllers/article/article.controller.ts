import * as utils from '@src/utils/index';
import { ArticleRequest } from '@src/interfaces/article.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
/**
 * @author
 * @description this controller contains actions for admin's articles related activities
 */

export class ArticleController {
    getTypeAndDisplayName(findObj, num: number) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }
    async createArticle(payload: ArticleRequest.CreateArticle, userData) {
        try {
            // Object.assign(payload, { uploadBy });
            const result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);
            payload.categoryType = result['TYPE'];
            payload.userId = userData._id;
            payload.userRole = userData.type;
            payload.createdAt = new Date().getTime();
            payload.updatedAt = new Date().getTime();
            const articleData = await ENTITY.ArticleE.createOneEntity(payload);
            return articleData;

        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getArticle(payload) {
        try {
            const articleData = await ENTITY.ArticleE.getArticlelist(payload);
            console.log('articleDataarticleData', articleData);
            return articleData;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getAllArticle() {
        try {
            await ENTITY.ArticleE.showAllArticle();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleService = new ArticleController();

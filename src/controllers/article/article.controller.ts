import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
import * as utils from '@src/utils';

class ArticleController {
    getTypeAndDisplayName(findObj, num: number) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }
    /**
     * @function createArticle
     * @description admin creata the aticle
     * @payload  CreateArticle
     */

    async createArticle(payload: ArticleRequest.CreateArticle, userData) {
        try {
            const result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);
            payload.categoryType = result['TYPE'];
            payload.userId = userData._id;
            payload.userRole = userData.type;
            const articleData = await ENTITY.ArticleE.createOneEntity(payload);
            return articleData;

        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @function getCategoryWiseArticles
     * @description get articlewiseCategory
     * @payload  GetArticle
     * return []
     */

    async getCategoryWiseArticles(payload: ArticleRequest.GetArticle) {
        try {
            return await ENTITY.ArticleE.allArticlesBasedOnCategory(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @function getArticleById
     * @description get articleById
     * @payload  GetArticleById
     * return []
     */

    async getArticleById(payload: ArticleRequest.GetArticleById) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            const article = await ENTITY.ArticleE.getOneEntity(criteria, {});
            if (!article)   return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            return article;
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @function getArticle
     * @description get article list
     * @payload  GetArticleById
     * return []
     */

    async getArticle(payload: ArticleRequest.GetArticle) {
        try {
            return await ENTITY.ArticleE.getArticlelist(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @function updateArticle
     * @description admin update thg article
     * @payload  UpdateArticle
     * return {data}
     */

    async updateArticle(payload: ArticleRequest.UpdateArticle, adminData) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            const dataToSet: any = {};
            if (payload.isFeatured) dataToSet.$set.isFeatured = payload.isFeatured;
            const result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);
            dataToSet.$set = {
                title: payload.title,
                categoryId: payload.categoryId,
                categoryType: result['TYPE'],
                imageUrl: payload.imageUrl,
                userId: adminData._id,
                userRole: adminData.type,
                description: payload.description,
            };
            dataToSet.$push = {
                articleAction: {
                    userRole: adminData.type,
                    userId: adminData._id,
                    actionTime: new Date().getTime(),
                },
            };
            return await ENTITY.ArticleE.updateOneEntity(criteria, dataToSet);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function deleteArticle
     * @description admin delete thg article
     * @payload  DeleteArticle
     * return {} sucess/error
     */

    async deleteArticle(payload: ArticleRequest.DeleteArticle) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            return await ENTITY.ArticleE.removeEntity(criteria);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleService = new ArticleController();

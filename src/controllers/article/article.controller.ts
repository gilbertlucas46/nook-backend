import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
import * as utils from '@src/utils';
import { Types } from 'mongoose';

class ArticleController {
    getTypeAndDisplayName(findObj, num: number) {
        const obj = findObj;
        const data = Object.values(obj);
        const result = data.filter((x: any) => {
            return x.NUMBER === num;
        });
        return result[0];
    }

    async addArticleName(payload: ArticleRequest.AddCategoriesName, adminData) {
        try {
            return await ENTITY.ArticleCategoryE.addArticleName(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @function createArticle
     * @description admin creata the aticle
     * @payload  CreateArticle
     */

    async createArticle(payload: ArticleRequest.CreateArticle, userData) {
        try {
            // const result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);
            // payload.categoryType = result['TYPE'];
            payload.userId = userData._id;
            payload.userRole = userData.type;
            payload.addedBy = userData.type;
            return await ENTITY.ArticleE.createOneEntity(payload);
        } catch (error) {
            utils.consolelog('error', error, true);
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
            utils.consolelog('error', error, true);
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
            if (!article) return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            return article;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    /**
     * @function getArticle
     * @description get article list
     * @payload  GetArticleById
     * return []
     */

    async getArticle(payload: ArticleRequest.GetArticle, userData?) {
        try {
            return await ENTITY.ArticleE.getArticlelist(payload, userData);
        } catch (error) {
            utils.consolelog('error', error, true);
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
            // if (payload.isFeatured) dataToSet.$set.isFeatured = payload.isFeatured;
            // const result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);
            dataToSet.$set = {
                ...payload,
                userId: adminData._id,
                addedBy: adminData.type,
            };
            dataToSet.$push = {
                articleAction: {
                    addedBy: adminData.type,
                    userId: adminData._id,
                    actionTime: new Date().getTime(),
                },
            };
            const data = await ENTITY.ArticleE.updateOneEntity(criteria, dataToSet);
            return data;
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
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async getCategoryList(payload) {
        try {
            return await ENTITY.ArticleCategoryE.getCategoryList(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getUserArticle(payload) {
        try {
            const data = await ENTITY.ArticleE.getUserArticle(payload);
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateCategoryList(payload: ArticleRequest.CategoryUpdate) {
        try {
            return await ENTITY.ArticleCategoryE.updateCategoryList(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleService = new ArticleController();

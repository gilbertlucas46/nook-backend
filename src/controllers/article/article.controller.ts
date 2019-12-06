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

    async addArticleName(payload, adminData) {
        try {
            return await ENTITY.ArticleCategoryE.addArticleName(payload);
        } catch (error) {
            console.log('errrrrororooroorooorooror', error);
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

    async getArticle(payload: ArticleRequest.GetArticle) {
        try {
            return await ENTITY.ArticleE.getArticlelist(payload);
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
                title: payload.title,
                categoryId: payload.categoryId,
                // categoryType: result['TYPE'],
                imageUrl: payload.imageUrl,
                userId: adminData._id,
                userRole: adminData.type,
                description: payload.description,
                isFeatured: payload.isFeatured,
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
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateCategoryList(payload) {
        try {
            return await ENTITY.ArticleCategoryE.updateCategoryList(payload);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async deleteCategory(payload) {
        try {
            const criteria = {
                _id: payload.id,
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleService = new ArticleController();

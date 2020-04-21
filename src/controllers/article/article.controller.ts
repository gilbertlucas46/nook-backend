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

            payload.name = payload.title.replace(/\s+/g, '-').replace(/\//g, '_').toLowerCase();
            const checkAlreadyAddedCriteria = {
                name: payload.name,
            };
            const checkArticleName = await ENTITY.ArticleE.getOneEntity(checkAlreadyAddedCriteria, {});
            console.log('checkArticleNamecheckArticleNamecheckArticleName', checkArticleName);

            if (!checkArticleName) {
                const dataToSave = {
                    name: payload.name,
                    title: payload.title,
                    ...payload,
                };
                return await ENTITY.ArticleE.createOneEntity(dataToSave);
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }
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

            if (!article) return Promise.reject(Constant.STATUS_MSG.SUCCESS.S204.NO_CONTENT_AVAILABLE);
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
            // const criteria = {
            //     _id: payload.articleId,
            // };
            if (payload.title) {
                payload.name = payload.title.replace(/\s+/g, '-').replace(/\//g, '_').toLowerCase();
            }
            const checkOldArticleCriteria = {
                _id: payload.articleId,
            };
            const oldArticleByName = {
                name: payload.name,
            };
            // const getArticleDataByName = await ENTITY.ArticleE.getOneEntity(checkOldArticleCriteria,{});
            const getOldArticleData = await ENTITY.ArticleE.getOneEntity(oldArticleByName, {});
            if (getOldArticleData.name === payload.name && getOldArticleData._id !== payload.articleId) {
                const dataToSet: any = {};
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
                const data = await ENTITY.ArticleE.updateOneEntity({ _id: payload.articleId }, dataToSet);
                return data;
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.ALREADY_EXIST);
            }

            // const data = await ENTITY.ArticleE.updateOneEntity(criteria, dataToSet);
            // return data;
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

    /**
     * @param payload articleID
     * for admin article
     */
    async getAdminArticleById(payload: ArticleRequest.GetArticleById) {
        try {
            // const criteria = {
            //     _id: payload.articleId,
            // };
            const article = await ENTITY.ArticleE.getAdminArticle(payload);
            if (!article) return Promise.reject(Constant.STATUS_MSG.ERROR.E404.DATA_NOT_FOUND);
            return article;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}




export const ArticleService = new ArticleController();

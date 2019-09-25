import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
import * as utils from '@src/utils';
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

    async getCategoryWiseArticles(payload) {
        try {
            const articleData = await ENTITY.ArticleE.allArticlesBasedOnCategory(payload);
            return articleData;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getArticleById(payload: ArticleRequest.GetArticleById) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            const article = await ENTITY.ArticleE.getOneEntity(criteria, {});
            return article;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getArticle(payload) {
        try {
            const articleData = await ENTITY.ArticleE.getArticlelist(payload);
            return articleData;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateArticle(payload: ArticleRequest.UpdateArticle, adminData) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            const dataToSet: any = {};
            let result;
            result = this.getTypeAndDisplayName(Constant.DATABASE.ARTICLE_TYPE, payload.categoryId);

            dataToSet.$set = {
                title: payload.title,
                categoryId: payload.categoryId,
                categoryType: result.TYPE,
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
                    // actionPerformedBy: {
                    //     userId: adminData._id,
                    //     userType: adminData.TYPE,
                    // },
                    // actionTime: new Date().getTime(),
                },
            };

            console.log('dataToSet', dataToSet);

            const updateStatus = await ENTITY.ArticleE.updateOneEntity(criteria, dataToSet);
            return updateStatus;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

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

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

    async updateArticle(payload, adminData) {
        try {
            const criteria = {
                _id: payload.articleId,
            };
            // let result: any;
            // const dataToSet: any = {};

            // if (payload.status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER);
            // } else if (payload.status === Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
            //     result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER);
            // } else {
            //     return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PROPERTY_STATUS);
            // }

            // dataToSet.$set = {
            // };

            // dataToSet.$push = {
            //     propertyActions: {
            //         actionNumber: result.NUMBER,
            //         actionString: result.TYPE,
            //         actionPerformedBy: {
            //             userId: adminData._id,
            //             userType: adminData.TYPE,
            //         },
            //         actionTime: new Date().getTime(),
            //     },
            // };
            // const updateStatus = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet);
            // return updateStatus;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async deleteArticle(payload) {
        try {
            // await ENTITY.ArticleE.

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export const ArticleService = new ArticleController();

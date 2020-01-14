import { ArticleRequest } from '@src/interfaces/article.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
import * as utils from '@src/utils';

class CategoryController {
    // getTypeAndDisplayName(findObj, num: number) {
    //     const obj = findObj;
    //     const data = Object.values(obj);
    //     const result = data.filter((x: any) => {
    //         return x.NUMBER === num;
    //     });
    //     return result[0];
    // }

    // async addArticleName(payload, adminData) {
    //     try {
    //         const data = ENTITY.ArticleE.addArticleName(payload);
    //         return data;

    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // }

    async deleteCategory(payload: ArticleRequest.CategoryId) {
        try {
            const criteria = {
                _id: payload.id,
            };
            const articleCriteria = {
                articleId: payload.id,
            };
            const articleCount = await ENTITY.ArticleE.count(articleCriteria);
            if (articleCount === 0) {
                const data = await ENTITY.ArticleCategoryE.removeEntity(criteria);
                return data;
            } else {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.DELETE_ARTICLE_FIRST);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

export const CategoryService = new CategoryController();

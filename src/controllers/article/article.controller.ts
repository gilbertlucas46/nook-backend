import * as utils from '@src/utils/index';
import { ArticleRequest } from '@src/interfaces/article.interface';
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '../../constants';
import * as ENTITY from '../../entity';
/**
 * @author
 * @description this controller contains actions for admin's account related activities
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
            console.log('userData.type=------------------', userData.type);
            const uploadedBy = {};
            // Object.assign(payload, { uploadBy });
            // if (payload.property_basic_details.property_for_number) {
            //  result = this.getTypeAndDisplayName(Constant.DATABASE.USER_TYPE, payload.property_basic_details.property_for_number);
            // }
            payload.uploadBy = {
                userId: userData._id,
                name: userData.name,
                type: userData.type,
              //  number: ;
                // DISPLAY_NAME:
            };

            payload.userId = userData._id;
            // payload.articleAction.push({
            //     updateBy: userData.name,
            //     userId: userData._id,
            //     updatedAt: new Date().getTime(),
            //     type: userData.type,
            // },
            // );
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

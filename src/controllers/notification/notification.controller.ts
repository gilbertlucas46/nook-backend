

import { NotificationE } from '@src/entity/notification/notification.entity';
import * as utils from '../../utils/index';
/**
 * @author Shivam Singh
 * @description this controller contains actions for notification
 */
class NotificationControllers{
    async getNotification(payload) {
        try {
            const notificationList = await NotificationE.notificationList(payload);
            const count = await NotificationE.countNotification();
            return {notificationList,count};
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async updateNotification(payload) {
        try {
            const data = await NotificationE.updateNotification(payload);
            return data;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    // async countNotification() {
    //     try {
    //         const data = await NotificationE.countNotification();
    //         return data;
    //     } catch (error) {
    //         utils.consolelog('error', error, true);
    //         return Promise.reject(error);
    //     }
    // }
}


export let NotificationController = new NotificationControllers();


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
            return notificationList;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}


export let NotificationController = new NotificationControllers();
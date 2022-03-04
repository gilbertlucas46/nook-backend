import { BaseEntity } from "@src/entity/base/base.entity";
import * as Constant from "@src/constants";
import { Types } from "mongoose";

class NotificationEntities extends BaseEntity {
  constructor() {
    super("Notification");
  }
  async notificationList(payload) {
    try {
      const notificationList = await this.DAOManager.findAll(
        "Notification",
        {},
        { referralId: 1, message: 1, isRead: 1, createdAt: 1 }
      );
      return notificationList;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async saveNotification(payload) {
    try {
      let notificationMessage=''
      if(Constant.DATABASE.NOTIFICATION_TYPE.IMAGE===payload.notificationType){
            notificationMessage =payload.firstName + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.IMAGE_MSG
    }
    else if(Constant.DATABASE.NOTIFICATION_TYPE.PERSONAL_DETAIL===payload.notificationType){
            notificationMessage =payload.firstName + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.PERSONAL_MSG
    }
    else{
      notificationMessage =payload.firstName + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.BOTH_MSG
    }
    let data={
      loanId:payload.loanId,
      notificationType:payload.notificationType,
      message:notificationMessage,
      isread:false,
      createdAt:payload.createdAt
    }
    this.DAOManager.saveData("Notification", data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export const NotificationE = new NotificationEntities();

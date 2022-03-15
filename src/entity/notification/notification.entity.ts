import { BaseEntity } from "@src/entity/base/base.entity";
import * as Constant from "@src/constants";
import { Types } from "mongoose";
import { LoanRequest } from "@src/interfaces/loan.interface";
import * as utils from '@src/utils';
import { NotificationRequest } from "@src/interfaces/notification.interface";

class NotificationEntities extends BaseEntity {
  constructor() {
    super("Notification");
  }
  async notificationList(payload:NotificationRequest.INotificationList) {
    try {
      const { 
        limit = Constant.SERVER.LIMIT,
        page = 1,
    } = payload;
    const skip = (limit * (page - 1));

    const paginateOptions = {
        page: page || 1,
        limit: limit || Constant.SERVER.LIMIT,
    };
    const matchPipeline = [
      
      {
          $sort: {
              _id: -1,
          },
      },
      {
          $project: {
              _id: 1,
              loanId:1,
              message:1,
              isRead:1,
              notificationType:1,
              createdAt:1

          },
      },
  ];
  const notificationList = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
      // const notificationList = await this.DAOManager.findAll(
      //   "Notification",
      //   {},
      //   { referralId: 1, message: 1, isRead: 1, createdAt: 1 }
      // );
      return notificationList;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async saveNotification(payload) {
    try {
      let notificationMessage='';
      let name=payload['personalInfo']['firstName'];
      console.log("notification type===>>>>>>>",payload.notificationType);
      if(Constant.DATABASE.NOTIFICATION_TYPE.IMAGE===payload.notificationType){
            notificationMessage = name + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.IMAGE_MSG;
    }
    else if(Constant.DATABASE.NOTIFICATION_TYPE.PERSONAL_DETAIL===payload.notificationType){
            notificationMessage = name + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.PERSONAL_MSG;
    }
    else{
      notificationMessage = name + ' ' + Constant.DATABASE.NOTIFICATION_MESSAGE.BOTH_MSG;
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
   /**
     * @description notification update
     * 
     */
    async updateNotification(payload) {
      try {
              // const isRead=payload.isRead
              // console.log(isRead)
          const data = await this.updateOneEntity({'_id':payload.Id},{'isRead':true});
          return data;
      } catch (error) {
          utils.consolelog('error', error, true);
          return Promise.reject(error);
      }
  }
  async countNotification() {
    try {
        const count = await this.count({'isRead':false});
        return count;
    } catch (error) {
        utils.consolelog('error', error, true);
        return Promise.reject(error);
    }
}

}

export const NotificationE = new NotificationEntities();

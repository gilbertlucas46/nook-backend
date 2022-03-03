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
      this.DAOManager.insert("Notification", { payload }, { new: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export const NotificationE = new NotificationEntities();

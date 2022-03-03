import { Schema, model, Document } from "mongoose";
import * as CONSTANT from "@src/constants/app.constant";

export interface INotification extends Document {
  referralId?: Schema.Types.ObjectId;
  // userName:string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

/**
 * @description used to track the notification history
 */
const notificationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  loanId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: [
      CONSTANT.DATABASE.STATUS.USER.ACTIVE,
      //   CONSTANT.DATABASE.STATUS.USER.BLOCKED,
      CONSTANT.DATABASE.STATUS.USER.DELETE,
    ],
    default: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
    index: true,
  },
  notificationType: {
    type: String,
    enum: Object.values(CONSTANT.DATABASE.NOTIFICATION_TYPE),
  },
  userId: { type: Schema.Types.ObjectId, required: true },
  // userName:{type:String},
  //   message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

// Export notification schema
export let Notification = model<INotification>(
  "Notification",
  notificationSchema
);

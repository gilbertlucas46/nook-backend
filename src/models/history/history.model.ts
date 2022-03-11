import { Schema, model, Document } from "mongoose";
import * as CONSTANT from "@src/constants/app.constant";

interface Action {
      type: string;
   }
export interface IHistory extends Document {
  loanId?: Schema.Types.ObjectId;
  updatedBy?:String;
  action: [Action];
  createdAt: number;
}
let action = new Schema(
      {
        // loanId:prevData.id,
        action:{types:Schema.Types.Mixed},
        // updatedBy:diffData.applicationStage.adminName,
      },
     
  );
/**
 * @description used to track loan application history
 */
const historySchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  loanId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  action: [action],
  updatedBy:{type:String},
  createdAt: { type: Number, default: Date.now },
});

// loanId:prevData.id,
// action:message,
// updatedBy:diffData.applicationStage.adminName,
// // interface PriceAndHireDuration {
//     type: number;
//     amount: number;
// }
// // Price and hire duration
// let price = new Schema(
//     {
//         type: {
//             type: Number,
//             enum: Object.values(CONSTANT.MINUMUM_HIRE_DURATION_TYPE),
//         }, // enum days, weeks, months
//         amount: { type: Number },
//     },
//     {
//         _id: false,
//     }
// );
//         price: [price],

// Export notification schema
export let History = model<IHistory>(
  "history",
  historySchema
);

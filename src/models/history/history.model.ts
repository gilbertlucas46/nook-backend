import { Schema, model, Document } from "mongoose";
import * as CONSTANT from "@src/constants/app.constant";

export interface IHistory extends Document {
  loanId?: Schema.Types.ObjectId;
  updatedBy?:String;
  Action: string[];
  createdAt: number;
}

/**
 * @description used to track loan application history
 */
const historySchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  loanId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  Action: {type:[{ type: String}]},
  updatedBy:{type:String},
  createdAt: { type: Number, default: Date.now },
});

// Export notification schema
export let History = model<IHistory>(
  "History",
  historySchema
);

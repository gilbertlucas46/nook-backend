import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

export interface IHelpCenterCategories extends Document {
    status: string;
    // title: string;
    name: string;
    userType: string;
    category: string;
    createdAt: number;
    updatedAt: number;
}

// export interface IHelpFulHelpCenter extends Document {
//     // userId: string;
//     // userRole: number;
//     helpCenterId: string;
//     ipAddress: string;
//     createdAt: number;
//     updatedAt: number;
//     isHelpful: boolean;
// }

// const HelpCenterStatusSchema = new Schema({
//     _id: { type: Schema.Types.ObjectId, required: true, auto: true },
//     helpCenterId: { type: Schema.Types.ObjectId, required: true, ref: 'helpcenter' },
//     ipAddress: { type: String, required: true, index: true },
//     createdAt: { type: Number, required: true },
//     updatedAt: { type: Number, required: true },
//     isHelpful: { type: Boolean },
// });

// export let HelpCenterStatus = model<IHelpFulHelpCenter>('helpcenterStatus', HelpCenterStatusSchema);

const helpCenterCategorySchema = new Schema({

    status: {
        type: String, enum: [
            Constant.DATABASE.HELP_CENTER_STATUS.ACTIVE,
            Constant.DATABASE.HELP_CENTER_STATUS.DELETED,
            Constant.DATABASE.HELP_CENTER_STATUS.BLOCKED,
        ], default: Constant.DATABASE.HELP_CENTER_STATUS.ACTIVE,
    },
    // title: { type: String },
    name: { type: String, required: true, unique: true, index: true },
    userType: {
        type: String,
        enum: [
            Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
            Constant.DATABASE.USER_TYPE.STAFF.TYPE,
        ],
    },
    category: {
        type: String, enum: [
            Constant.DATABASE.HELP_CENTER_TYPE.BANK_FAQ.TYPE,
            Constant.DATABASE.HELP_CENTER_TYPE.STAFF_FAQ.TYPE,
            // Constant.DATABASE.HELP_CENTER_TYPE.USER_FAQ.TYPE,
        ],
    },
    addedBy: [{
        userRole: {
            type: String,
            enum: [
                Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
                Constant.DATABASE.USER_TYPE.STAFF.TYPE,
            ],
        },
        adminId: { type: Schema.Types.ObjectId },
    }],

    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
}, {
        versionKey: false,
    });


export let HelpCentreCategory = model('helpcentercategory', helpCenterCategorySchema);

// helpCenterCategory.index({ title: -1 });
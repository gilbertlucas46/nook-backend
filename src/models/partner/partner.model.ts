
import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from '../../constants';
import * as shortid from 'shortid';
// shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const PartnerSchema = new Schema({
    logoUrl: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Admin', index: true, required: true },
    shortId: { type: String, default: shortid.generate, unique: true },
    name: { type: String, unique: true },
    displayName: { type: String, unique: true },
    status: {
        type: String, enum: [
            CONSTANT.DATABASE.PartnerStatus.ACTIVE,
            CONSTANT.DATABASE.PartnerStatus.BLOCK,
            CONSTANT.DATABASE.PartnerStatus.DELTE,
        ],
    },
    counter: { type: Number, default: 0 },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    //     referenceId: { type: String },
    // });
    // schema.pre('save', function (this: any, next: () => void) {
    //     if (!this.referenceId) {
    //         this.referenceId = `USR${++global.counters.LoanApplication}`;
    //     }
    //     next();
});

export const Partner = model('partner', PartnerSchema);

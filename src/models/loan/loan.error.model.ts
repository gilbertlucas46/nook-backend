import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from './../../constants';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from './../../constants';

const schema = new Schema({
    data: { type: Schema.Types.Mixed },

    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    // saveAsDraft: { type: Schema.Types.Boolean, default: false },

    referenceId: { type: String, index: true, unique: true },
    createdAt: { type: Schema.Types.Number, index: true },
    updatedAt: { type: Schema.Types.Number },
},
    {
        versionKey: false,
    },
);

// schema.pre('save', function (this: any, next: () => void) {
//     if (!this.referenceId) {
//         this.referenceId = `USR${++global.counters.LoanApplication}`;
//     }
//     next();
// });

export const LoanErrorCheck = model('loanerror', schema);
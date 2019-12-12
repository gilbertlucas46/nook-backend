import { Schema, model } from 'mongoose';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK } from '../../constants';

const UserLoanCriteria = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    bankId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Bank' },
    loanForEmploymentType: [
        {
            employmentType: {
                type: String,
                enum: [
                    EMPLOYMENT_TYPE.BPO.value,
                    EMPLOYMENT_TYPE.GOVT.value,
                    EMPLOYMENT_TYPE.OFW.value,
                    EMPLOYMENT_TYPE.PRIVATE.value,
                    EMPLOYMENT_TYPE.PROFESSIONAL.value,
                    EMPLOYMENT_TYPE.SELF.value,
                ],
            },
            employmentRank: [{ type: String, enum: Object.keys(EMPLOYMENT_RANK)}],
            minEmploymentTenure: {
                type: Number,
                default: 0,
            },
        },
    ],
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const Userloancriteria = model('userloancriterias', UserLoanCriteria);
import { Schema, model } from 'mongoose';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK } from '../../constants';

const UserEmploymentCriteria = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    bankId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Bank' },
    LoanForEmploymentType: [
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
            employmentRank: {
                type: [String],
                enum: [
                    EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
                    EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
                    EMPLOYMENT_RANK.CHAIRMAN.value,
                    EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
                    EMPLOYMENT_RANK.CLERK.value,
                    EMPLOYMENT_RANK.DIRECTOR.value,
                    EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
                    EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
                    EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
                    EMPLOYMENT_RANK.MANAGER.value,
                    EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
                    EMPLOYMENT_RANK.OWNER.value,
                    EMPLOYMENT_RANK.PRESIDENT.value,
                    EMPLOYMENT_RANK.PROFESSIONAL.value,
                    EMPLOYMENT_RANK.RANK_FILE.value,
                    EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
                    EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
                    EMPLOYMENT_RANK.SENIOR_MANAGER.value,
                    EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
                    EMPLOYMENT_RANK.SUPERVISOR.value,
                    EMPLOYMENT_RANK.VICE_PRESIDENT.value,
                ],
            },
            minEmploymentTenure: {
                type: Number,
                default: 0,
            },
        },
    ],
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

export const UserEmployment = model('useremployment', UserEmploymentCriteria);
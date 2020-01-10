import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from './../../constants';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from './../../constants';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    // saveAsDraft: { type: Schema.Types.Boolean, default: false },
    applicationStatus: {
        type: Schema.Types.String,
        default: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
        enum: Object.values(CONSTANT.DATABASE.LOAN_APPLICATION_STATUS).map(({value}) => value),
    },
    personalInfo: {
        firstName: { type: Schema.Types.String, trim: true },
        middleName: { type: Schema.Types.String, trim: true },
        lastName: { type: Schema.Types.String, trim: true },
        motherMaidenName: { type: Schema.Types.String, trim: true },
        gender: {
            type: Schema.Types.String, enum: [
                CONSTANT.DATABASE.GENDER.MALE,
                CONSTANT.DATABASE.GENDER.FEMALE,
                CONSTANT.DATABASE.GENDER.OTHER,
            ],
        },
        educationBackground: {
            type: Schema.Types.String, enum: [
                CONSTANT.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
                CONSTANT.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
                CONSTANT.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
                CONSTANT.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
            ],
        },
        civilStatus: {
            type: Schema.Types.String, enum: [
                CONSTANT.DATABASE.CIVIL_STATUS.SINGLE,
                CONSTANT.DATABASE.CIVIL_STATUS.WIDOW,
                CONSTANT.DATABASE.CIVIL_STATUS.SEPERATED,
                CONSTANT.DATABASE.CIVIL_STATUS.MARRIED,
            ],
        },
        birthDate: { type: Schema.Types.Number },
        monthlyIncome: { type: Schema.Types.Number, default: 0 },
        otherIncome : { type: Schema.Types.Number, default: 0 },
        spouseInfo: {
            firstName: { type: Schema.Types.String, trim: true },
            middleName: { type: Schema.Types.String, trim: true },
            lastName: { type: Schema.Types.String, trim: true },
            birthDate: { type: Schema.Types.Number },
            monthlyIncome: { type: Schema.Types.Number, default: 0 },
            isCoborrower: { type: Boolean, default: false },
        },
        coBorrowerInfo: {
            firstName: { type: Schema.Types.String, trim: true },
            middleName: { type: Schema.Types.String, trim: true },
            lastName: { type: Schema.Types.String, trim: true },
            monthlyIncome: { type: Schema.Types.Number, default: 0 },
            birthDate: { type: Schema.Types.Number },
            relationship: {
                type: Schema.Types.String, enum: [
                    CONSTANT.DATABASE.RELATIONSHIP.BROTHER,
                    CONSTANT.DATABASE.RELATIONSHIP.FATHER,
                    CONSTANT.DATABASE.RELATIONSHIP.MOTHER,
                    CONSTANT.DATABASE.RELATIONSHIP.SISTER,
                    CONSTANT.DATABASE.RELATIONSHIP.SPOUSE,
                    CONSTANT.DATABASE.RELATIONSHIP.SON,
                    CONSTANT.DATABASE.RELATIONSHIP.DAUGHTER,
                ],
            },
        },
    },

    bankInfo: {
        bankId: { type: Schema.Types.ObjectId },
        bankName: { type: Schema.Types.String },
        abbrevation: { type: Schema.Types.String },
        iconUrl: { type: String },
    },

    contactInfo: {
        phoneNumber: { type: Schema.Types.String, trim: true },
        email: { type: Schema.Types.String, trim: true },
        mobileNumber: { type: Schema.Types.String, trim: true },
        currentAddress: {
            address: { type: Schema.Types.String, index: true },
            homeOwnership: {
                type: Schema.Types.String, enum: [
                    CONSTANT.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
                    CONSTANT.DATABASE.HOME_OWNERSHIP.MORTGAGED,
                    CONSTANT.DATABASE.HOME_OWNERSHIP.OWNED,
                    CONSTANT.DATABASE.HOME_OWNERSHIP.RENTED,
                    CONSTANT.DATABASE.HOME_OWNERSHIP.USED_FREE,
                ],
            },
        },
    },

    loanDetails: {
        maxLoanTerm: { type: Schema.Types.Number },
        fixedPeriod: { type: Schema.Types.Number },
        loanTerm: { type: Schema.Types.Number },
        rate: { type: Schema.Types.Number },
        monthlyRepayment: { type: Schema.Types.Number },
        hasCoBorrower: { type: Boolean },
        loanType: { type: String },
        loanPercent: { type: Number },
        loanAmount: { type: Number },
    },

    propertyInfo: {
        value: { type: Number },
        type: { type: String, enum: Object.keys(CONSTANT.LOAN_PROPERTY_TYPES) },
        status: { type: String, enum: Object.keys(CONSTANT.LOAN_PROPERTY_STATUS) },
        developer: { type: String },
    },

    employmentInfo: {
        companyIndustry: { type: Schema.Types.String, enum: Object.keys(CONSTANT.INDUSTRIES) },
        tin: { type: Schema.Types.String, trim: true },
        companyName: { type: Schema.Types.String, trime: true },
        sss: { type: Schema.Types.String, trim: true },
        officePhone: { type: Schema.Types.String, trim: true },
        officeEmail: { type: Schema.Types.String, trim: true },
        officeAddress: { type: Schema.Types.String, trim: true },

        coBorrowerInfo: {
            employmentType: { type: Schema.Types.String, enum: Object.keys(CONSTANT.EMPLOYMENT_TYPE) },
            tin: { type: Schema.Types.String, trim: true },
            companyName: { type: Schema.Types.String, trime: true },
            sss: { type: Schema.Types.String, trim: true },
            employmentRank: { type: Schema.Types.String, enum: Object.keys(CONSTANT.EMPLOYMENT_RANK) },
            employmentTenure: { type: Schema.Types.String, enum: Object.keys(EMPLOYMENT_TENURE) },
            companyIndustry: { type: Schema.Types.String, enum: Object.keys(CONSTANT.INDUSTRIES) },
            officePhone: { type: Schema.Types.String, trim: true },
            officeEmail: { type: Schema.Types.String, trim: true },
            officeAddress: { type: Schema.Types.String, trim: true },
        },
    },

    dependentsInfo: [
        {
            name: { type: Schema.Types.String, trim: true },
            age: { type: Schema.Types.Number },
            relationship: { type: Schema.Types.String, enum: Object.values(CONSTANT.DATABASE.RELATIONSHIP) },
        },
    ],

    propertyDocuments: {
        borrowerValidDocIds: [Schema.Types.String],
        coBorrowerValidId: [Schema.Types.String],
        latestITR: { type: Schema.Types.String },
        employmentCert: { type: Schema.Types.String },
        purchasePropertyInfo: {
            address: { type: Schema.Types.String, index: true },
            contactPerson: { type: Schema.Types.String, trim: true },
            contactNumber: { type: Schema.Types.String, trim: true },
            collateralDocStatus: { type: Schema.Types.Boolean },
            collateralDocList: [{
                docType: {
                    type: Schema.Types.String, enum: [
                        CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
                        CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
                        CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
                        CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
                        CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
                    ],
                },
                docUrl: {
                    type: Schema.Types.String,
                    trim: true,
                },
            }],
        },
        nookAgent: { type: Schema.Types.String, trim: true },
    },

    approvedBy: [{
        adminId: { type: Schema.Types.ObjectId },
        adminName: { type: String },
        approvedAt: { type: Number },
    }],

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

export const LoanApplication = model('loanapplications', schema);
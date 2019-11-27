import { Schema, Document, model, Types } from 'mongoose';
import * as CONSTANT from './../../constants';
import { EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from './../../constants';
// import { LOAN_PROPERTY_TYPES, LOAN_PROPERTY_STATUS, EMPLOYMENT_TYPE, EMPLOYMENT_RANK, EMPLOYMENT_TENURE } from '@src/constants';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    saveAsDraft: { type: Schema.Types.Boolean, default: false },
    applicationStatus: {
        type: Schema.Types.String, enum: [
            // CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
            // CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
            // CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
            CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
        ],
        default: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
    },
    personalInfo: {
        firstName: { type: Schema.Types.String, trim: true },
        middleName: { type: Schema.Types.String, trim: true },
        lastName: { type: Schema.Types.String, trim: true },
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
        spouseFirstName: { type: Schema.Types.String, trim: true },
        spouseMiddleName: { type: Schema.Types.String, trim: true },
        spouseLastName: { type: Schema.Types.String, trim: true },
        birthDate: { type: Schema.Types.Number },
        coBorrowerFirstName: { type: Schema.Types.String, trim: true },
        coBorrowerMiddleName: { type: Schema.Types.String, trim: true },
        coBorrowerLastName: { type: Schema.Types.String, trim: true },
        motherMaidenName: { type: Schema.Types.String, trim: true },
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
    bankInfo: {
        bankId: { type: Schema.Types.ObjectId },
        bankName: { type: Schema.Types.String },
        abbrevation: { type: Schema.Types.String },
    },
    contactInfo: {
        phoneNumber: { type: Schema.Types.String, trim: true },
        email: { type: Schema.Types.String, trim: true },
        mobileNumber: { type: Schema.Types.String, trim: true },
        // property_address: {
        currentAddress: {
            address: { type: Schema.Types.String, index: true },
            // regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
            // cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
            // regionName: { type: Schema.Types.String },
            // cityName: { type: Schema.Types.String },
            // barangay: { type: Schema.Types.String },
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
        fixedPeriod: { type: Schema.Types.Number },
        loanTerm: { type: Schema.Types.Number },
        rate: { type: Schema.Types.Number },
        monthlyRepayment: { type: Schema.Types.Number },
        hasCoBorrower: { type: Boolean },
        loanType : {type: String},
        loanPercent : {type: Number},
        loanAmount : {type: Number},
        propertyValue : {type : Number},
    },
    employmentInfo: {
        companyIndustry: {
            type: Schema.Types.String, enum: [
                CONSTANT.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
                CONSTANT.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
                CONSTANT.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
                CONSTANT.DATABASE.INDUSTRY.COMMUNICATION,
                CONSTANT.DATABASE.INDUSTRY.CONSTRUCTION,
                CONSTANT.DATABASE.INDUSTRY.EDUCATION,
                CONSTANT.DATABASE.INDUSTRY.IT,
                CONSTANT.DATABASE.INDUSTRY.OTHERS,
            ],
        },
        tin: { type: Schema.Types.String, trim: true },
        companyName: { type: Schema.Types.String, trime: true },
        sss: { type: Schema.Types.String, trim: true },
        officePhone: { type: Schema.Types.String, trim: true },
        officeEmail: { type: Schema.Types.String, trim: true },
        officeAddress: { type: Schema.Types.String, trim: true },
        // cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
        // cityName: { type: Schema.Types.String },
        // regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
        // regionName: { type: Schema.Types.String, trim: true },
        // barangay: { type: Schema.Types.String, trim: true },
        // country: { type: Schema.Types.String, trim: true },
        coBorrowerInfo: {
            employmentType: {
                type: Schema.Types.String, enum: [
                    EMPLOYMENT_TYPE.BPO.value,
                    EMPLOYMENT_TYPE.GOVT.value,
                    EMPLOYMENT_TYPE.OFW.value,
                    EMPLOYMENT_TYPE.PRIVATE.value,
                    EMPLOYMENT_TYPE.PROFESSIONAL.value,
                    EMPLOYMENT_TYPE.SELF.value,
                ],
            },
            tin: { type: Schema.Types.String, trim: true },
            companyName: { type: Schema.Types.String, trime: true },
            sss: { type: Schema.Types.String, trim: true },
            employmentRank: {
                type: Schema.Types.String, enum: [
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
            employmentTenure: {
                type: Schema.Types.String, enum: Object.keys(EMPLOYMENT_TENURE),
            },
            companyIndustry: {
                type: Schema.Types.String, enum: [
                    CONSTANT.DATABASE.INDUSTRY.AGRI_FOREST_FISH,
                    CONSTANT.DATABASE.INDUSTRY.ACCOMOD_FOOD_SERVICES,
                    CONSTANT.DATABASE.INDUSTRY.ARTS_ENTERTAINMENT_RECREATION,
                    CONSTANT.DATABASE.INDUSTRY.COMMUNICATION,
                    CONSTANT.DATABASE.INDUSTRY.CONSTRUCTION,
                    CONSTANT.DATABASE.INDUSTRY.EDUCATION,
                    CONSTANT.DATABASE.INDUSTRY.IT,
                    CONSTANT.DATABASE.INDUSTRY.OTHERS,
                ],
            },
            officePhone: { type: Schema.Types.String, trim: true },
            officeEmail: { type: Schema.Types.String, trim: true },
            officeAddress: { type: Schema.Types.String, trim: true },
            // cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
            // cityName: { type: Schema.Types.String },
            // regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
            // regionName: { type: Schema.Types.String, trim: true },
            // barangay: { type: Schema.Types.String, trim: true },
            // country: { type: Schema.Types.String, trim: true },
        },
    },
    dependentsInfo: [
        {
            name: { type: Schema.Types.String, trim: true },
            age: { type: Schema.Types.Number },
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
    ],
    propertyDocuments: {
        borrowerValidDocIds: [Schema.Types.String],
        coBorrowerValidId: [Schema.Types.String],
        latestITR: { type: Schema.Types.String },
        employmentCert: { type: Schema.Types.String },
        purchasePropertyInfo: {
            address: { type: Schema.Types.String, index: true },
            // regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
            // cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
            // regionName: { type: Schema.Types.String },
            // cityName: { type: Schema.Types.String },
            // barangay: { type: Schema.Types.String },
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
    referenceId: { type: String, index: true },
    createdAt: { type: Schema.Types.Number, index: true },
    updatedAt: { type: Schema.Types.Number },
},
    {
        versionKey: false,
    },
);

schema.pre('save', function(this: any, next: () => void) {
    if (!this.referenceId) {
        // this.referenceId = `USR${++global.counters.LoanApplication}`;
    }
    next();
});

export const LoanApplication = model('loanapplications', schema);
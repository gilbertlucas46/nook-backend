import { Schema, model } from 'mongoose';
import * as CONSTANT from '../constants/app.constant';

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, index: true, required: true },
    saveAsDraft: { type: Schema.Types.Boolean, default: false },
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
                CONSTANT.DATABASE.CIVI_STATUS.SINGLE,
                CONSTANT.DATABASE.CIVI_STATUS.WIDOW,
                CONSTANT.DATABASE.CIVI_STATUS.SEPERATED,
                CONSTANT.DATABASE.CIVI_STATUS.MARRIED,
            ],
        },
        spouseFirstName: { type: Schema.Types.String, trim: true },
        spouseMiddleName: { type: Schema.Types.String, trim: true },
        spouseLastName: { type: Schema.Types.String, trim: true },
        birthDate: { type: Schema.Types.Date },
        coBorrowerFirstName: { type: Schema.Types.String, trim: true },
        coBorrowerMiddleName: { type: Schema.Types.String, trim: true },
        coBorrowerLastName: { type: Schema.Types.String, trim: true },
        relationship: {
            type: Schema.Types.String, enum: [
                CONSTANT.DATABASE.RELATIONSHIP.BROTHER,
                CONSTANT.DATABASE.RELATIONSHIP.FATHER,
                CONSTANT.DATABASE.RELATIONSHIP.MOTHER,
                CONSTANT.DATABASE.RELATIONSHIP.SISTER,
                CONSTANT.DATABASE.RELATIONSHIP.SPOUSE,
            ],
        },
    },
    contactInfo: {
        phoneNo: { type: Schema.Types.Number, trim: true },
        email: { type: Schema.Types.String, trim: true },
        mobileNo: { type: Schema.Types.Number, trim: true },
    },
    property_address: {
        address: { type: Schema.Types.String, index: true },
        regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
        cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
        regionName: { type: Schema.Types.String },
        cityName: { type: Schema.Types.String },
        barangay: { type: Schema.Types.String },
        location: {
            type: {
                type: Schema.Types.String,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
            },
        },
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
    loanDetails: {
        fixedPeriod: { type: Schema.Types.String, trim: true },
        loanTerm: { type: Schema.Types.String, trim: true },
        rate: { type: Schema.Types.Number, trim: true },
        monthlyRepayment: { type: Schema.Types.Number, trim: true },
    },
    borrowerEmploymentInfo: {
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
        officePhone: { type: Schema.Types.Number, trim: true },
        officeEmail: { type: Schema.Types.String, trim: true },
        officeAddress: { type: Schema.Types.String, trim: true },
        cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
        cityName: { type: Schema.Types.String },
        regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
        regionName: { type: Schema.Types.String, trim: true },
        barangay: { type: Schema.Types.String, trim: true },
        country: { type: Schema.Types.String, trim: true },
    },
    coBorrowerInfo: {
        employmentType: {},
        tin: { type: Schema.Types.String, trim: true },
        companyName: { type: Schema.Types.String, trime: true },
        sss: { type: Schema.Types.String, trim: true },
        employmentRank: {},
        employmentTenure: {},
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
        officePhone: { type: Schema.Types.Number, trim: true },
        officeEmail: { type: Schema.Types.String, trim: true },
        officeAddress: { type: Schema.Types.String, trim: true },
        cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
        cityName: { type: Schema.Types.String },
        regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
        regionName: { type: Schema.Types.String, trim: true },
        barangay: { type: Schema.Types.String, trim: true },
        country: { type: Schema.Types.String, trim: true },
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
                ],
            },
        },
    ],
    legalDoc: {
        borrowerValidId: [Schema.Types.String],
        coBorrowerValidId: [Schema.Types.String],
        LatestITR: { type: Schema.Types.String },
        employmentCert: { type: Schema.Types.String },
    },
    purchasePropertyInfo: {
        address: { type: Schema.Types.String, index: true },
        regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
        cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
        regionName: { type: Schema.Types.String },
        cityName: { type: Schema.Types.String },
        barangay: { type: Schema.Types.String },
        location: {
            type: {
                type: Schema.Types.String,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
            },
        },
        contactPerson: { type: Schema.Types.String, trim: true },
        contactNumber: { type: Schema.Types.Number, trim: true },
        collateralDocStatus: { type: Schema.Types.Boolean },
        collDocUrl: [{
            docUrl: {
                type: Schema.Types.String,
                trim: true,
            },
            docType: {
                type: Schema.Types.String, enum: [
                    CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
                    CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
                    CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
                    CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
                    CONSTANT.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
                ],
            },
        }],
    },
    nookAgent: { type: Schema.Types.String, trim: true },
    createdAt: { type: Schema.Types.Number },
    updatedAt: { type: Schema.Types.Number },
});

export const HomeLoan = model('homeloans', schema);
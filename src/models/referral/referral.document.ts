import { Document, Types } from 'mongoose';
export interface ILoanReferral {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    notes: string;
    createdAt: number;
    updatedAt: number;
    userId: Types.ObjectId;
}

export interface LoanReferralDocument extends Document, ILoanReferral { }

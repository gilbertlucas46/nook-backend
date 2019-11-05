import { Document, Types } from 'mongoose';
// import { RegionDocument } from '../region';
// import { Location } from '@src/interfaces/region.interface';

// export interface ICity {
// 	name: string;
// 	region: Types.ObjectId;
// 	location: Location.ILocationPoint;
// 	images?: string[];
// 	createdAt?: number;
// 	updatedAt?: number;
// }

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

// export interface ICityRegion {
// 	region: RegionDocument;
// }

export interface LoanReferralDocument extends Document, ILoanReferral { }

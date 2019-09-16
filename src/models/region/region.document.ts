import { Document } from 'mongoose';
import { Location } from '@src/interfaces/region.interface';

export interface IRegion {
	fullName: string;
	shortName: string;
	location: Location.ILocationPoint;
	images?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface RegionDocument extends Document, IRegion {}

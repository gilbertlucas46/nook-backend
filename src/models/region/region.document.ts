import { Document } from 'mongoose';
import { Location } from '@src/interfaces/region.interface';

export interface IRegion {
	fullName: string;
	shortName: string;
	location: Location.ILocationPoint;
	images?: string[];
	createdAt?: number;
	updatedAt?: number;
}

export interface RegionDocument extends Document, IRegion { }

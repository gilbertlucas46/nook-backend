import { Document, Types } from 'mongoose';
import { RegionDocument } from '../region';
import { Location } from '@src/interfaces/region.interface';

export interface ICity {
	name: string;
	region: Types.ObjectId;
	location: Location.ILocationPoint;
	images?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICityRegion {
	region: RegionDocument;
}

export interface CityDocument extends Document, ICity {}

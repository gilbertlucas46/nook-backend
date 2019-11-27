import { Types } from 'mongoose';
export namespace Location {
	export interface ILocationPoint {
		type: 'Point' | 'Sphere';
		coordinates: [number, number];
	}
	export interface Region {
		fullName: string;
		shortName: string;
		location: ILocationPoint;
	}
	export interface RegionDocument extends Region {
		_id: Types.ObjectId;
		createdAt: Date;
		updated: Date;
	}
	export interface DirectoryPlace {
		name: string;
		address: string;
		email: string;
		website: string;
		telephone: string;
		locationUrl: string;
		imageUrl: string;
	}
	export interface CityDirectory {
		medical: DirectoryPlace[];
		shopping: DirectoryPlace[];
		others: DirectoryPlace[];
	}
	export interface City {
		name: string;
		location: ILocationPoint;
		subTitle?: string;
		isFeatured?: boolean;
		mapUrl?: string;
		description?: string;
		images?: string[];
		directory?: CityDirectory;
	}
	export interface CityData extends City {
		region: Types.ObjectId | RegionDocument;
	}
	export interface CityDocument extends CityData {
		_id: Types.ObjectId;
		createdAt: Date;
		updated: Date;
	}

	export interface RegionLocation extends Region {
		cities: City[];
	}
	export interface RegionLocationDocument extends RegionDocument {
		cities: CityDocument[];
	}
}

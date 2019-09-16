import { Document } from 'mongoose';
export interface ISession extends Document {
	userId?: string;
	validAttempt: boolean;
	ipAddress: string;
	deviceToken: string;
	deviceType: string;
	source: string;
	deviceModel: string;
	appVersion?: string;
	createdAt: number;
	updatedAt: number;
}

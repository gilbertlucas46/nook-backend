import { Schema, model, Model } from 'mongoose';
import { RegionDocument } from './region.document';

const regionSchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	fullName: { type: String, required: true },
	shortName: { type: String, required: true },
	location: {
		type: {
			type: String,
			default: 'Point',
			required: true,
		},
		coordinates: [
			{ type: Number, required: true },
			{ type: Number, required: true },
		],
	},
	images: [String],
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
});

export const Region: Model<RegionDocument> = model('regions', regionSchema);

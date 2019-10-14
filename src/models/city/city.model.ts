import { Schema, model, Model, Types } from 'mongoose';
import { CityDocument } from './city.document';

const citySchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	name: { type: String, required: true },
	region: { type: Types.ObjectId, required: true, ref: 'regions' },
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
	images: [Number],
	createdAt: { type: Number, required: true, default: new Date().getTime() },
	updatedAt: { type: Number, required: true, default: new Date().getTime() },
});

export const City: Model<CityDocument> = model('cities', citySchema);

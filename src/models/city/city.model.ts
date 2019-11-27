import { Schema, model, Model, Types } from 'mongoose';
import { CityDocument } from './city.document';

const citySchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	name: { type: String, required: true },
	region: { type: Types.ObjectId, required: true, ref: 'regions' },
	subTitle: String,
	isFeatured: { type: Boolean, default: false },
	mapUrl: String,
	description: String,
	directory: {
		medical: [
			{
				name: String,
				email: String,
				address: String,
				website: String,
				imageUrl: String,
				telephone: String,
				locationUrl: String,
			},
		],
		shopping: [
			{
				name: String,
				email: String,
				address: String,
				website: String,
				imageUrl: String,
				telephone: String,
				locationUrl: String,
			},
		],
		others: [
			{
				name: String,
				email: String,
				address: String,
				website: String,
				imageUrl: String,
				telephone: String,
				locationUrl: String,
			},
		],
	},
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
	createdAt: { type: Number, required: true, default: new Date().getTime() },
	updatedAt: { type: Number, required: true, default: new Date().getTime() },
}, {
		versionKey: false,
	});

export const City: Model<CityDocument> = model('cities', citySchema);

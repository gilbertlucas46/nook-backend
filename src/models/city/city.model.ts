import { Schema, model, Model, Types } from 'mongoose';
import { CityDocument } from './city.document';

const citySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	region: {
		type: Types.ObjectId,
		required: true,
		ref: 'regions',
	},
	location: {
		type: {
			type: String,
			default: 'Point',
			required: true,
		},
		coordinates: [
			{
				type: Number,
				required: true,
			},
			{
				type: Number,
				required: true,
			},
		],
	},
	images: [Number],
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
}, {
	collection: 'cities',
	timestamps: true,
});

export const City: Model<CityDocument> = model('cities', citySchema);

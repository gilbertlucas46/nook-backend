import { Schema, Document, model } from 'mongoose';
import * as Constant from '../constants';

export interface ISavedProperty extends Document {
    userId: string;
    propertyId: string;
}

const savedPropertySchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
});

savedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export let SavedProperty = model<ISavedProperty>('SavedProperty', savedPropertySchema);
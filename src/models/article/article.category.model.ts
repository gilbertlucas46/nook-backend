import { Schema, Document, model } from 'mongoose';
import * as Constant from '../../constants';

export interface ICategory extends Document {
    name: string;
    status: string;
    createdAt: number;
    updatedAt: number;
}
const categories = new Schema({
    name: { type: String, unique: true, reuqired: true },
    status: { type: String, default: 'Active' },
    title: { type: String, unique: true },
    createdAt: { type: Number, required: true, default: new Date().getTime() },
    updatedAt: { type: Number, required: true, default: new Date().getTime() },
}, {
        versionKey: false,
    });

export const ArticleCategories = model<ICategory>('articleCategory', categories);

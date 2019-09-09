import { Schema, Document, model } from 'mongoose';
import * as shortid from 'shortid';
import * as Constant from '../constants';

export interface IProperty extends Document {
    createdAt?: number;
    updatedAt?: number;
    property_features: {
        storeys_2: boolean;
        security_24hr: boolean;
        air_conditioning: boolean;
        balcony: boolean;
        basketball_court: boolean;
        business_center: boolean;
        carpark: boolean;
        CCTV_monitoring: boolean;
        child_playground: boolean;
        clothes_dryer: boolean;
        club_house: boolean;
        day_care: boolean;
        den: boolean;
        fully_furnished: boolean;
        function_Room: boolean;
        garden: boolean;
        gym: boolean;
        laundry: boolean;
        loft: boolean;
        maids_room: boolean;
        microwave: boolean;
        parking: boolean;
        pet_friendly: boolean;
        refrigerator: boolean;
        semi_furnished: boolean;
        sky_deck: boolean;
        spa: boolean;
        swimming_pool: boolean;
        tennis_court: boolean;
        TV_cable: boolean;
        unfurnished: boolean;
        washing_machine: boolean;
        wiFi: boolean;
    }
    property_details: {
        floor_area: number;
        floor_area_unit: string;
        // land_area: number;
        // land_area_unit: string;
        lot_area: number;
        lot_area_unit: string;
        bedrooms: number;
        bathrooms: number;
        garages: number;
        garage_size: number;
        buildYear: number;
    }
    property_address: {
        address: string;
        region: string;
        city: string;
        barangay: string;
        location: {
            type: string;
            coordinates: [number];
        }
    }
    property_basic_details: {
        title: string;
        description: string;
        type: string;
        status: number;
        label: string;
        sale_rent_price: number;
        price_currency: string;
        price_label: string; // monthly
    },
    property_added_by: {
        userId?: string;
        userName: string;
        contactNo: string;
        imageUrl: string;
    }
    propertyImages: string[];
};

const propertySchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    createdAt: { type: Number, default: new Date().getTime() },
    updatedAt: { type: Number, default: new Date().getTime() },
    propertyId: { type: String, default: shortid.generate },
    property_features: {
        storeys_2: { type: Boolean, default: false },
        security_24hr: { type: Boolean, default: false },
        air_conditioning: { type: Boolean, default: false },
        balcony: { type: Boolean, default: false },
        basketball_court: { type: Boolean, default: false },
        business_center: { type: Boolean, default: false },
        carpark: { type: Boolean, default: false },
        CCTV_monitoring: { type: Boolean, default: false },
        child_playground: { type: Boolean, default: false },
        clothes_dryer: { type: Boolean, default: false },
        club_house: { type: Boolean, default: false },
        day_care: { type: Boolean, default: false },
        den: { type: Boolean, default: false },
        fully_furnished: { type: Boolean, default: false },
        function_Room: { type: Boolean, default: false },
        garden: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        laundry: { type: Boolean, default: false },
        loft: { type: Boolean, default: false },
        maids_room: { type: Boolean, default: false },
        microwave: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        pet_friendly: { type: Boolean, default: false },
        refrigerator: { type: Boolean, default: false },
        semi_furnished: { type: Boolean, default: false },
        sky_deck: { type: Boolean, default: false },
        spa: { type: Boolean, default: false },
        swimming_pool: { type: Boolean, default: false },
        tennis_court: { type: Boolean, default: false },
        TV_cable: { type: Boolean, default: false },
        unfurnished: { type: Boolean, default: false },
        washing_machine: { type: Boolean, default: false },
        wiFi: { type: Boolean, default: false }
    },
    property_details: {
        floor_area: { type: Number },
        floor_area_unit: { type: String, default: 'm2' },
        //land_area: { type: Number },
        // land_area_unit: { type: String },
        lot_area: { type: Number },
        lot_area_unit: { type: String, default: 'm2' },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        garages: { type: Number },
        garage_size: { type: Number },
        buildYear: { type: Number },
    },
    property_address: {
        address: { type: String, required: true },
        region: { type: String },
        city: { type: String },
        barangay: { type: String },
        location: {
            type: {
                type: String,
                // enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true
            }

        }
    },
    property_basic_details: {
        title: { type: String },
        description: { type: String },
        type: {
            type: String,
            enum: [
                Constant.DATABASE.PROPERTY_TYPE.NONE,
                Constant.DATABASE.PROPERTY_TYPE["APPARTMENT/CONDO"],
                Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
                Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
                Constant.DATABASE.PROPERTY_TYPE.LAND,
                Constant.DATABASE.PROPERTY_TYPE.ROOM,
            ], index: true
        },
        status: {
            type: Number,
            required: true
        },
        label: {
            type: String,
            enum: [
                Constant.DATABASE.PROPERTY_LABEL.NONE,
                Constant.DATABASE.PROPERTY_LABEL.FORECLOSURE,
                Constant.DATABASE.PROPERTY_LABEL.OFFICE,
                Constant.DATABASE.PROPERTY_LABEL.PARKING,
                Constant.DATABASE.PROPERTY_LABEL.PRE_SELLING,
                Constant.DATABASE.PROPERTY_LABEL.READY_FOR_OCCUPANCY,
                Constant.DATABASE.PROPERTY_LABEL.RENT_TO_OWN,
                Constant.DATABASE.PROPERTY_LABEL.RETAIL,
                Constant.DATABASE.PROPERTY_LABEL.SERVICED_OFFICE,
                Constant.DATABASE.PROPERTY_LABEL.WAREHOUSE,
            ], index: true
        },
        sale_rent_price: { type: Number },
        price_currency: { type: String, default: 'Php' },
        price_label: {
            type: String,
            enum: [
                Constant.DATABASE.PRICE_LABEL.DAILY,
                Constant.DATABASE.PRICE_LABEL.WEEKLY,
                Constant.DATABASE.PRICE_LABEL.MONTHLY,
                Constant.DATABASE.PRICE_LABEL.QUATERLY,
                Constant.DATABASE.PRICE_LABEL.HALFYEARLY,
                Constant.DATABASE.PRICE_LABEL.YEARLY,
            ], index: true
        },
    },
    property_added_by: {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        userName: { type: String },
        phoneNumber: { type: String },
        imageUrl: { type: String },
    },
    Property_status: {
        type: String,
        enum: [
            Constant.DATABASE.PROPERTY_STATUS.PENDING,
            Constant.DATABASE.PROPERTY_STATUS.DRAFT,
            Constant.DATABASE.PROPERTY_STATUS.ACTIVE,
            Constant.DATABASE.PROPERTY_STATUS.SOLD,
            Constant.DATABASE.PROPERTY_STATUS.RENTED,
            Constant.DATABASE.PROPERTY_STATUS.EXPIRED,
            Constant.DATABASE.PROPERTY_STATUS.FEATURED,
        ],
        default: Constant.DATABASE.PROPERTY_STATUS.ACTIVE // TODO change it to be pending after admin panel
    },
    property_rent_time: { type: Number },
    property_sold_time: { type: Number },
    property_approved_time: { type: Number },
    proprty_expired_time: { type: Number },
    actions_performed_by_admin: {
        type: String,
        enum: [
            Constant.DATABASE.ACTIONS_PERFORMED_BY_ADMIN.PENDING,
            Constant.DATABASE.ACTIONS_PERFORMED_BY_ADMIN.APPROVED,
            Constant.DATABASE.ACTIONS_PERFORMED_BY_ADMIN.REJECTED,
            Constant.DATABASE.ACTIONS_PERFORMED_BY_ADMIN.BLOCKED,
        ],
        default: Constant.DATABASE.ACTIONS_PERFORMED_BY_ADMIN.APPROVED // TODO change it to be pending after admin panel
    },
    propertyImages: { type: [String] },
});

/* Create 2dsphere index */
propertySchema.index({
    'property_address.location': '2dsphere'
});

export let Property = model<IProperty>('Property', propertySchema)

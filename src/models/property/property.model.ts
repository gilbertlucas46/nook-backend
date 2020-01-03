import { Schema, Document, model } from 'mongoose';
// import * as shortid from 'shortid';
import * as Constant from '../../constants';
// shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
import { incrementNumber } from '../../utils';
export interface IPropertyActions extends Document {
	actionNumber?: number;
	actionString?: string;
	actionDisplayName?: string;
	actionPerformedBy?: IActionPerformedBy;
}

export interface IActionPerformedBy extends Document {
	userId: string;
	userType: string;
	actionTime: Date;
	message?: string;
}

export interface IProperty extends Document {
	createdAt?: number;
	updatedAt?: number;
	approvedAt: number;
	property_features: {
		storeys_2?: boolean;
		security_24hr?: boolean;
		air_conditioning?: boolean;
		balcony?: boolean;
		basketball_court?: boolean;
		business_center?: boolean;
		carpark?: boolean;
		CCTV_monitoring?: boolean;
		child_playground?: boolean;
		clothes_dryer?: boolean;
		club_house?: boolean;
		day_care?: boolean;
		den?: boolean;
		fully_furnished?: boolean;
		function_Room?: boolean;
		garden?: boolean;
		gym?: boolean;
		laundry?: boolean;
		loft?: boolean;
		maids_room?: boolean;
		microwave?: boolean;
		parking?: boolean;
		pet_friendly?: boolean;
		refrigerator?: boolean;
		semi_furnished?: boolean;
		sky_deck?: boolean;
		spa?: boolean;
		swimming_pool?: boolean;
		tennis_court?: boolean;
		TV_cable?: boolean;
		unfurnished?: boolean;
		washing_machine?: boolean;
		wiFi?: boolean;
	};
	property_details: {
		floor_area?: number;
		floor_area_unit?: string;
		// land_area: number;
		// land_area_unit: string;
		lot_area?: number;
		lot_area_unit?: string;
		bedrooms?: number;
		bathrooms?: number;
		garages?: number;
		garage_size?: number;
		buildYear?: number;
	};
	property_address: {
		address: string;
		regionId: string;
		regionName: string,
		cityId: string,
		cityName: string,
		barangay: string;
		location?: {
			type: string;
			coordinates: number[];
		}
	};
	property_basic_details: {
		name: string;
		title: string;
		description: string;
		type: string;
		property_for_number: number;
		property_for_string: string;
		property_for_displayName: string;
		label: string;
		sale_rent_price: number;
		price_currency: string;
		price_label: string; // monthly
	};
	property_added_by: {
		userId?: string;
		userName: string;
		phoneNumber?: string;
		profilePicUrl?: string;
		firstName?: string,
		middleName?: string,
		lastName?: string,
		email?: string,
	};
	actions_performed_by_admin: {
		number: number;
		string: string;
		displayName: string;
	};
	propertyImages: string[];
	isFeatured: boolean;
	isHomePageFeatured: boolean;
	property_status: {
		number: number;
		status?: string;
		displayName: string;
	};
	propertyActions: IPropertyActions[];
	sold_rent_time: number;
	isUserBlockedByAdmin: boolean;
}

const propertySchema = new Schema({
	_id: { type: Schema.Types.ObjectId, required: true, auto: true },
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
	createdAt: { type: Number, required: true },
	updatedAt: { type: Number, required: true },
	propertyId: { type: Number },
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
		wiFi: { type: Boolean, default: false },
	},
	property_details: {
		floor_area: { type: Number },
		// floor_area_unit: { type: String, default: 'm2' },
		// land_area: { type: Number },
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
		address: { type: String, required: true, index: true },
		regionId: { type: Schema.Types.ObjectId, ref: 'Region', index: true }, // Refer to region schema
		cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },     // Refer to city schema
		regionName: { type: String },
		cityName: { type: String },
		barangay: { type: String },
		location: {
			type: {
				type: String,
				default: 'Point',
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
	},
	property_basic_details: {
		title: { type: String },
		name: { type: String, unique: true },
		description: { type: String },
		type: {
			type: String,
			enum: [
				Constant.DATABASE.PROPERTY_TYPE.NONE,
				Constant.DATABASE.PROPERTY_TYPE['APPARTMENT/CONDO'],
				Constant.DATABASE.PROPERTY_TYPE.COMMERCIAL,
				Constant.DATABASE.PROPERTY_TYPE.HOUSE_LOT,
				Constant.DATABASE.PROPERTY_TYPE.LAND,
				Constant.DATABASE.PROPERTY_TYPE.ROOM,
			], index: true,
		},
		property_for_number: {
			type: Number,
			enum: [
				Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER,
				Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER,
			],
		},
		property_for_string: {
			type: String,
			enum: [
				Constant.DATABASE.PROPERTY_FOR.RENT.TYPE,
				Constant.DATABASE.PROPERTY_FOR.SALE.TYPE,
			],
		},
		property_for_displayName: {
			type: String,
			enum: [
				Constant.DATABASE.PROPERTY_FOR.RENT.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_FOR.SALE.DISPLAY_NAME,
			],
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
			], index: true,
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
			], index: true,
		},
	},
	property_added_by: {
		userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
		userName: { type: String },
		phoneNumber: { type: String },
		profilePicUrl: { type: String },
		firstName: { type: String },
		middleName: { type: String },
		lastName: { type: String },
		email: { type: String },
		userType: { type: String },
	},
	property_status: {
		number: {
			type: Number,
			enum: [
				Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
				Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
				Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
				Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
				Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
				Constant.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER,
			], index: true,
			default: Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
		},
		status: {
			type: String,
			enum: [
				Constant.DATABASE.PROPERTY_STATUS.DRAFT.TYPE,
				Constant.DATABASE.PROPERTY_STATUS.PENDING.TYPE,
				Constant.DATABASE.PROPERTY_STATUS.ACTIVE.TYPE,
				Constant.DATABASE.PROPERTY_STATUS.DECLINED.TYPE,
				Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
				Constant.DATABASE.PROPERTY_STATUS.EXPIRED.TYPE,
			], index: true,
			default: Constant.DATABASE.PROPERTY_STATUS.PENDING.TYPE,
		},
		displayName: {
			type: String,
			enum: [
				Constant.DATABASE.PROPERTY_STATUS.DRAFT.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_STATUS.PENDING.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_STATUS.ACTIVE.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_STATUS.DECLINED.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME,
				Constant.DATABASE.PROPERTY_STATUS.EXPIRED.DISPLAY_NAME,
			], index: true,
			default: Constant.DATABASE.PROPERTY_STATUS.PENDING.DISPLAY_NAME,
		},
	},
	sold_rent_time: { type: Number },
	property_expiry_time: { type: Number },
	isUserBlockedByAdmin: { type: Boolean },  // is blocked by Admin
	actions_performed_by_admin: {
		number: {
			type: Number,
			enum: [
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.APPROVED.NUMBER,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.REJECTED.NUMBER,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.BLOCKED.NUMBER,
			],
		},
		status: {
			type: String,
			enum: [
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.APPROVED.TYPE,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.REJECTED.TYPE,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.BLOCKED.TYPE,
			],
		},
		displayName: {
			type: String,
			enum: [
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.APPROVED.DISPLAY_NAME,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.REJECTED.DISPLAY_NAME,
				Constant.DATABASE.ACTIONS_PERFORMED_BY_NOOK.BLOCKED.DISPLAY_NAME,
			],
		},
	},
	approvedAt: { type: Number },
	isFeatured: { type: Boolean, default: false },
	isHomePageFeatured: { type: Boolean, default: false },
	propertyActions: [
		{
			actionNumber: {
				type: Number,
				enum: [
					Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.PENDING.NUMBER,

					Constant.DATABASE.PROPERTY_ACTIONS.POSTED.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.APPROVED.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.REJECTED.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.BLOCKED.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.NUMBER,
					Constant.DATABASE.PROPERTY_ACTIONS.EXPIRED.NUMBER,
				],
			},
			actionString: {
				type: String,
				enum: [
					Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.PENDING.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.POSTED.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.APPROVED.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.REJECTED.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.BLOCKED.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.TYPE,
					Constant.DATABASE.PROPERTY_ACTIONS.EXPIRED.TYPE,
				],
			},
			actionDisplayName: {
				type: String,
				enum: [
					Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.PENDING.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.POSTED.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.APPROVED.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.REJECTED.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.BLOCKED.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.DISPLAY_NAME,
					Constant.DATABASE.PROPERTY_ACTIONS.EXPIRED.DISPLAY_NAME,
				],
			},
			actionPerformedBy: {
				userId: { type: Schema.Types.ObjectId },
				userType: {
					type: String,
					enum: [
						Constant.DATABASE.USER_TYPE.AGENT.TYPE,
						Constant.DATABASE.USER_TYPE.ADMIN.TYPE,
						Constant.DATABASE.USER_TYPE.OWNER.TYPE,
						Constant.DATABASE.USER_TYPE.TENANT.TYPE,
						Constant.DATABASE.USER_TYPE.STAFF.TYPE,
					],
				},
				actionTime: { type: Number },
				action: { type: String },
				// message: { type: String },
			},
		},
	],
	propertyImages: { type: [String] },
});

/* Create 2dsphere index */
propertySchema.index({
	'property_address.location': '2dsphere',
});

propertySchema.pre('save', function (this: any, next: () => void) {
	if (!this.propertyId) {
		this.propertyId = incrementNumber(++global.counters.Property);
	}
	next();
});

export const Property = model<IProperty>('properties', propertySchema);

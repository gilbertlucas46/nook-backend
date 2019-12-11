export namespace PropertyRequest {
	export interface PropertyData {
		propertyId?: string;    // in the case of update
		createdAt?: number;
		updatedAt?: number;
		userId?: string;
		property_added_by?: object;
		property_status?: object;
		propertyActions?: object[];
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
			floor_area?: number,
			lot_area?: number,
			bedrooms?: number,
			bathrooms?: number,
			garages?: number,
			garage_size?: number,
			buildYear?: number,
		};
		property_address: {
			address: string,
			region: string,
			city: string,
			barangay: string,
			location: any,
		};
		property_basic_details: {
			title?: string
			description?: string
			type?: string
			property_for_number?: number
			// property_for_type: Joi.string(),
			label?: string
			sale_rent_price?: number,
			price_currency?: string,
			price_label?: string,
			property_for_string?: any,
			property_for_displayName?: any;
		};
		isFeatured: boolean;
		isHomePageFeatured: boolean;
		subscriptionId?: string;
		propertyImages: string[];
	}

	export interface PropertyDetail {
		_id: string;
	}
	export interface UserProperty {
		propertyType?: number;
		userId: string;
		page: number;
		limit: number;
		propertyId: string;
		sortType?: number;
		sortBy: string;
		propertyFor?: number;
	}
	export interface SearchProperty {
		page?: number;
		limit?: number;
		sortBy?: string;
		searchTerm?: string;
		sortType?: number;
		fromDate?: number;
		toDate?: number;
		propertyType?: number;
		propertyId?: string;
		type?: string;
		label?: string[];
		maxPrice?: number;
		minPrice?: number;
		bedrooms?: number;
		bathrooms?: number;
		minArea?: number;
		maxArea?: number;
		permissionType?: string;
		property_status?: number;
		property_features?: string[];
		byRegion?: string;
		byCity?: string;
		screenType?: string;
	}
	export interface UpdatePropertyByAction {
		propertyId: string;
		status?: string;
		upgradeToFeature?: boolean;
		upgradeToHomePageFeatured?: boolean;
	}

	export interface IPaginate {
		page?: number;
		limit?: number;
		propertyType: string;
	}

	export interface PropertyByStatus {
		propertyType?: number;
		page: number;
		limit: number;
		sortType?: number;
		sortBy?: string;
	}
}

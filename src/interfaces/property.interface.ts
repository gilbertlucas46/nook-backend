declare namespace PropertyRequest {


    export interface PropertyData {
        propertyId?: string;    // in the case of update
        createdAt?: number;
        updatedAt?: number;
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
        }
        property_details: {
            floor_area?: string;
            floor_area_unit?: string;
            land_area?: number;
            land_area_unit?: string;
            bedrooms?: number;
            bathrooms?: number;
            Garages?: number;
            buildYear?: number;
        }
        property_address: {
            address: string;
            region?: string;
            city?: string;
            Barangay?: string;
            location?: {
                type?: string;
                coordinates?: [number];
            }
        }
        property_basic_details: {
            title?: string;
            description?: string;
            type?: string;
            status?: string;
            label?: string;
            sale_rent_price: number;
            price_currency?: string;
            price_label?: string; // monthly
        },
        propertyImages: string[]
    }

    export interface PropertyDetail {
        _id: string
    }
}



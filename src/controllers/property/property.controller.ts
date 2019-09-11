
import * as Constant from '../../constants/app.constant'
import * as ENTITY from '../../entity';
import { mongo } from 'mongoose';
const { ObjectId } = mongo;

export class PropertyController {
    constructor() { }

    async addProperty(payload: PropertyRequest.PropertyData, userData: UserRequest.userData) {
        try {
            let criteria = {
                _id: payload.propertyId
            }
            payload['updatedAt'] = new Date().getTime()

            if (payload.propertyId) {
                let updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
                return updateData;
            }
            let userId = userData._id;
            payload['userId'] = userId;
            payload['property_added_by'] = {};
            payload['property_added_by']['userId'] = userData._id;
            payload['property_added_by']['phoneNumber'] = userData.phoneNumber;
            payload['property_added_by']['imageUrl'] = userData.profilePicUrl
            payload['property_added_by']['userName'] = userData.userName
            let propertyData = await ENTITY.PropertyE.createOneEntity(payload);
            return propertyData;

        } catch (error) {
            return Promise.reject(error)
        }
    }

    async searchProperties(payload: PropertyRequest.SearchProperty) {
        try {
            let { page, limit, searchTerm, sortBy, sortType, propertyId, propertyType, type, label, maxPrice, minPrice } = payload;
            if (!limit) limit = Constant.SERVER.LIMIT;
            else limit = limit;
            if (!page) page = 1;
            else page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject = { $match: {} };
            
            if (searchTerm) {
                // for filtration
                searchCriteria = {
                    $match: {
                        $or: [
                            { 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
                        ]
                    }
                }
            } else {
                searchCriteria = {
                    $match: {
                    }
                }
            }

            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        sortingType = {
                            sale_rent_price: sortType
                        }
                        break;

                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        }
                        break;
                }
            } else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                }
            }

            if (propertyId) matchObject['$match']['_id'] = new ObjectId(propertyId);
            if (propertyType && propertyType !== 3) matchObject['$match']['property_basic_details.status'] = propertyType;
            if (type && type !== 'all') matchObject['$match']['property_basic_details.type'] = type;

            if (label && label[0] !== 'all') {
                for (let i = 0; i < label.length; i++) {
                    matchObject['$match']['property_basic_details.label'] = label;
                }
            }

            // creating the pipeline for mongodb
            const pipeLine = [
                matchObject,
                searchCriteria,
                { $sort: sortingType },
            ];

            let propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
            return propertyData;

        } catch (err) {
            return Promise.reject(err);
        }
    }

    async nearbyProperties(payload: PropertyRequest.nearByProperty) {
        try {
            let { page, limit, searchTerm, sortBy, sortType, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea } = payload;
            if (!limit) limit = Constant.SERVER.LIMIT;
            else limit = limit;
            if (!page) page = 1;
            else page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject = { $match: {} };

            if (searchTerm) {
                // for filtration
                searchCriteria = {
                    $match: {
                        $or: [
                            { 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
                        ]
                    }
                }
            } else {
                searchCriteria = {
                    $match: {
                    }
                }
            }

            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        sortingType = {
                            sale_rent_price: sortType
                        }
                        break;

                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        }
                        break;
                }
            } else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                }
            }

            if (label && label[0] !== 'all') {
                for (let i = 0; i < label.length; i++) {
                    matchObject['$match']['property_basic_details.label'] = label;
                }
            }

            if (bedrooms) matchObject['$match']['property_details.bedrooms'] = bedrooms;
            if (bathrooms) matchObject['$match']['property_details.bathrooms'] = bathrooms;
            if (minArea) matchObject['$match']['property_details.floor_area'] = { $gt: minArea };
            if (maxArea) matchObject['$match']['property_details.floor_area'] = { $lt: maxArea };
            if (minPrice) matchObject['$match']['property_basic_details.sale_rent_price'] = { $gt: minPrice };
            if (maxPrice) matchObject['$match']['property_basic_details.sale_rent_price'] = { $lt: maxPrice };
            if (propertyId) matchObject['$match']['propertyId'] = new ObjectId(propertyId);
            if (propertyType && propertyType !== 3) matchObject['$match']['property_basic_details.status'] = propertyType;
            if (type && type !== 'all') matchObject['$match']['property_basic_details.type'] = type;


            // creating the pipeline for mongodb
            const pipeLine = [
                matchObject,
                searchCriteria,
                {
                    $sort: sortingType
                },
            ];

            // let propertyData = await ENTITY.PropertyE.aggregate([
            //     {
            //         '$geoNear': {
            //             near: { type: "Point", "coordinates": [28.535517, 77.391029] },
            //             maxDistance: 100000,
            //             query: pipeLine,
            //             distanceField: "calculatedDistance",
            //             spherical: true
            //         }
            //     },
            //     {
            //         $project: {
            //             _id: 1,
            //             property_basic_details: 1,
            //             createdAt: 1,
            //             property_address: 1
            //         }
            //     }
            // ]);

            let propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
            return propertyData;

        } catch (err) {
            return Promise.reject(err);
        }
    }
    async userPropertyByStatus(payload, userData) {
        try {
            if (payload.propertyType == Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER) {
                let criteria = {
                    $match: {
                        userId: userData._id,
                        $or: [{ "property_basic_details.property_for_number": Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER },
                        { "property_basic_details.property_for_number": Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER }]
                    },
                }
                const pipeLine = [criteria]
                let data = await ENTITY.PropertyE.ProprtyByStatus(pipeLine)
                return data
            }
            let criteria = {
                $match: {
                    userId: userData._id,
                    Property_status: payload.propertyType
                },
            }
            const pipeLine = [criteria]
            let data = await ENTITY.PropertyE.ProprtyByStatus(pipeLine)
            return data
        }

        catch (error) {
            return Promise.reject(error)
        }
    }

    async saveAsDraft(payload: PropertyRequest.PropertyData, userData: UserRequest.userData) {
        try {
            if (payload.propertyId) {
                let criteria = { _id: payload.propertyId }
                let updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
                return updateData;
            }
            payload['updatedAt'] = new Date().getTime();
            payload['Property_status']['number'] = Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER;
            payload['Property_status']['status'] = Constant.DATABASE.PROPERTY_STATUS.DRAFT.STRING;
            payload['Property_status']['displayName'] = Constant.DATABASE.PROPERTY_STATUS.DRAFT.DISPLAY_NAME;

            let userId = userData._id;
            payload['userId'] = userId;
            payload['property_added_by'] = {};
            payload['property_added_by']['userId'] = userData._id;
            payload['property_added_by']['phoneNumber'] = userData.phoneNumber;
            payload['property_added_by']['imageUrl'] = userData.profilePicUrl
            payload['property_added_by']['userName'] = userData.userName
            let propertyData = await ENTITY.PropertyE.createOneEntity(payload);
            return propertyData;
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
export let PropertyService = new PropertyController();

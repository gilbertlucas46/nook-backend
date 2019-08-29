
import * as config from 'config';
import * as UniversalFunctions from '../../utils'
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
            console.log('userDataaa', userData);

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
            let { page, limit, searchTerm, sortBy, sortType, fromDate, toDate, propertyId, status, type, label, maxPrice, minPrice } = payload;

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
                            { 'property_basic_details.title': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_basic_details.description': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_basic_details.type': new RegExp('.*' + searchTerm + '.*', 'i') },
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

            if (propertyId) {
                matchObject['$match']['_id'] = new ObjectId(propertyId)
            }

            if (type) {
                matchObject['$match']['property_basic_details']['type'] = type
            }

            if (label) {
                matchObject['$match']['property_basic_details']['type'] = label
            }

            // creating the pipeline for mongodb
            const pipeLine = [
                matchObject,
                searchCriteria,
                {
                    $sort: sortingType
                },
            ];
            let propertyData = await ENTITY.PropertyE.aggregate(pipeLine);
            return propertyData;

        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export let PropertyService = new PropertyController();

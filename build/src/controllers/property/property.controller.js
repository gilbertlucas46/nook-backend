"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constant = require("../../constants/app.constant");
const ENTITY = require("../../entity");
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.mongo;
const utils = require("../../utils");
class PropertyController {
    constructor() { }
    getTypeAndDisplayName(findObj, number) {
        let obj = findObj;
        let data = Object.values(obj);
        var result = data.filter((x) => {
            return x.NUMBER == number;
        });
        return result[0];
    }
    async addProperty(payload, userData) {
        try {
            let result;
            let property_status;
            let property_action;
            let criteria = {
                _id: payload.propertyId
            };
            if (payload.property_basic_details.property_for_number) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_FOR, payload['property_basic_details']['property_for_number']);
            }
            payload['property_basic_details']['property_for_string'] = result.TYPE;
            payload['property_basic_details']['property_for_displayName'] = result.DISPLAY_NAME;
            property_action = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_ACTIONS, Constant.DATABASE.PROPERTY_ACTIONS.PENDING.NUMBER);
            let userId = userData._id;
            payload['userId'] = userId;
            payload['property_added_by'] = {
                userId: userData._id,
                phoneNumber: userData.phoneNumber,
                imageUrl: userData.profilePicUrl,
                userName: userData.userName
            };
            payload['property_status'] = Constant.DATABASE.PROPERTY_STATUS.PENDING;
            payload['propertyActions'] = [{
                    actionString: property_action.TYPE,
                    actionDisplayName: property_action.DISPLAY_NAME,
                    actionPerformedBy: {
                        userId: userData._id,
                        userTypeString: userData.type,
                        actionTime: new Date().getTime(),
                    }
                }];
            if (payload.propertyId) {
                payload['updatedAt'] = new Date().getTime();
                let updateData = await ENTITY.PropertyE.updateOneEntity(criteria, payload);
                return updateData;
            }
            let propertyData = await ENTITY.PropertyE.createOneEntity(payload);
            return propertyData;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async searchProperties(payload) {
        try {
            let { page, limit, searchTerm, sortBy, sortType, propertyId, propertyType, type, label, maxPrice, minPrice } = payload;
            if (!limit)
                limit = Constant.SERVER.LIMIT;
            else
                limit = limit;
            if (!page)
                page = 1;
            else
                page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject = { $match: {} };
            if (searchTerm) {
                searchCriteria = {
                    $match: {
                        $or: [
                            { 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
                        ]
                    }
                };
            }
            else {
                searchCriteria = {
                    $match: {}
                };
            }
            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        sortingType = {
                            sale_rent_price: sortType
                        };
                        break;
                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        };
                        break;
                }
            }
            else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                };
            }
            if (propertyId)
                matchObject['$match']['_id'] = new ObjectId(propertyId);
            if (propertyType && propertyType !== 3)
                matchObject['$match']['property_basic_details.property_for_number'] = propertyType;
            if (type && type !== 'all')
                matchObject['$match']['property_basic_details.type'] = type;
            if (label && label[0] !== 'all') {
                for (let i = 0; i < label.length; i++) {
                    matchObject['$match']['property_basic_details.label'] = label;
                }
            }
            const pipeLine = [
                matchObject,
                searchCriteria,
                { $sort: sortingType },
            ];
            let propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
            return propertyData;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async nearbyProperties(payload) {
        try {
            let { page, limit, searchTerm, sortBy, sortType, propertyId, propertyType, type, label, maxPrice, minPrice, bedrooms, bathrooms, minArea, maxArea } = payload;
            if (!limit)
                limit = Constant.SERVER.LIMIT;
            else
                limit = limit;
            if (!page)
                page = 1;
            else
                page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject = { $match: {} };
            if (searchTerm) {
                searchCriteria = {
                    $match: {
                        $or: [
                            { 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.region': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.city': new RegExp('.*' + searchTerm + '.*', 'i') },
                            { 'property_address.barangay': new RegExp('.*' + searchTerm + '.*', 'i') },
                        ]
                    }
                };
            }
            else {
                searchCriteria = {
                    $match: {}
                };
            }
            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        sortingType = {
                            sale_rent_price: sortType
                        };
                        break;
                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        };
                        break;
                }
            }
            else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                };
            }
            if (label && label[0] !== 'all') {
                for (let i = 0; i < label.length; i++) {
                    matchObject['$match']['property_basic_details.label'] = label;
                }
            }
            if (bedrooms)
                matchObject['$match']['property_details.bedrooms'] = bedrooms;
            if (bathrooms)
                matchObject['$match']['property_details.bathrooms'] = bathrooms;
            if (minArea)
                matchObject['$match']['property_details.floor_area'] = { $gt: minArea };
            if (maxArea)
                matchObject['$match']['property_details.floor_area'] = { $lt: maxArea };
            if (minPrice)
                matchObject['$match']['property_basic_details.sale_rent_price'] = { $gt: minPrice };
            if (maxPrice)
                matchObject['$match']['property_basic_details.sale_rent_price'] = { $lt: maxPrice };
            if (propertyId)
                matchObject['$match']['propertyId'] = new ObjectId(propertyId);
            if (propertyType && propertyType !== 3)
                matchObject['$match']['property_basic_details.status'] = propertyType;
            if (type && type !== 'all')
                matchObject['$match']['property_basic_details.type'] = type;
            const pipeLine = [
                matchObject,
                searchCriteria,
                {
                    $sort: sortingType
                },
            ];
            let propertyData = await ENTITY.PropertyE.PropertyList(pipeLine);
            return propertyData;
        }
        catch (err) {
            utils.consolelog('error', err, true);
            return Promise.reject(err);
        }
    }
    async userPropertyByStatus(payload, userData) {
        try {
            let { page, limit, searchTerm, sortBy, sortType, propertyId, propertyType, type, label, maxPrice, minPrice } = payload;
            if (!limit)
                limit = Constant.SERVER.LIMIT;
            else
                limit = limit;
            if (!page)
                page = 1;
            else
                page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject = { $match: {} };
            if (sortBy) {
                switch (sortBy) {
                    case 'price':
                        sortBy = 'price';
                        sortingType = {
                            "property_basic_details.sale_rent_price": sortType
                        };
                        break;
                    case 'date':
                        sortBy = 'date';
                        sortingType = {
                            createdAt: sortType
                        };
                        break;
                    default:
                        sortBy = 'isFeatured';
                        sortingType = {
                            isFeatured: sortType
                        };
                        break;
                }
            }
            else {
                sortBy = 'isFeatured';
                sortingType = {
                    isFeatured: sortType,
                };
            }
            let criteria = {
                $match: {
                    userId: userData._id,
                    "property_status.number": sortBy,
                }
            };
            let pipeline = [
                criteria,
                {
                    $sort: sortingType
                }
            ];
            let data = await ENTITY.PropertyE.ProprtyByStatus(pipeline);
            console.log('datadatadatadatadata', data);
            return data;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async saveAsDraft(payload, userData) {
        try {
            let result;
            let property_status;
            let property_action;
            let criteria = {
                _id: payload.propertyId
            };
            if (payload['property_basic_details']['property_for_number']) {
                result = await this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_FOR, payload['property_basic_details']['property_for_number']);
                payload['property_basic_details'] = {
                    property_for_string: result.TYPE,
                    property_for_displayName: result.DISPLAY_NAME
                };
            }
            property_action = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_ACTIONS, Constant.DATABASE.PROPERTY_ACTIONS.DRAFT.NUMBER);
            payload['property_status'] = {
                number: Constant.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER,
                status: Constant.DATABASE.PROPERTY_STATUS.DRAFT.TYPE,
                displayName: Constant.DATABASE.PROPERTY_STATUS.DRAFT.DISPLAY_NAME
            };
            let userId = userData._id;
            payload['userId'] = userId;
            payload['property_added_by'] = {
                userId: userData._id,
                phoneNumber: userData.phoneNumber,
                imageUrl: userData.profilePicUrl,
                userName: userData.userName
            };
            payload['propertyActions'] = [{
                    actionString: property_action.TYPE,
                    actionDisplayName: property_action.DISPLAY_NAME,
                    actionPerformedBy: {
                        userId: userData._id,
                        userTypeString: userData.type,
                        actionTime: new Date().getTime(),
                    }
                }];
            let propertyData = await ENTITY.PropertyE.createOneEntity(payload);
            return propertyData;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async updatePropertyStatus(payload, userData) {
        try {
            let data_to_set = {};
            let criteria = {
                userId: userData._id,
                _id: payload.propertyId
            };
            if (payload.status) {
                data_to_set['$set'] = {
                    property_status: {
                        number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
                        status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
                        displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME
                    }
                };
                data_to_set['$push'] = {
                    propertyActions: {
                        actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.NUMBER,
                        actionString: Constant.DATABASE.PROPERTY_ACTIONS.SOLD_RENTED.TYPE,
                        actionPerformedBy: {
                            userId: userData._id,
                            userTypeNumber: "",
                            userTypeString: userData.TYPE
                        },
                        actionTime: new Date().getTime()
                    }
                };
            }
            else if (payload.upgradeToFeature) {
                data_to_set['$set'] = {
                    isFeatured: payload.upgradeToFeature
                };
                data_to_set['$push'] = {
                    propertyActions: {
                        actionNumber: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.NUMBER,
                        actionString: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.TYPE,
                        displayName: Constant.DATABASE.PROPERTY_ACTIONS.ISFEATURED.DISPLAY_NAME,
                        actionPerformedBy: {
                            userId: userData._id,
                            userTypeNumber: "",
                            userTypeString: userData.TYPE
                        },
                        actionTime: new Date().getTime()
                    }
                };
            }
            let update = await ENTITY.PropertyE.updateOneEntity(criteria, data_to_set, { new: true });
            return update;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}
exports.PropertyController = PropertyController;
exports.PropertyService = new PropertyController();
//# sourceMappingURL=property.controller.js.map
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import { User } from '../../models';
import { EnquiryRequest } from '@src/interfaces/enquiry.interface';

/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class EnquiryController {
    constructor() { }
    // async createEnquiry(payload: EnquiryRequest.createEnquiry) {
    //     try {
    //         let createGuestUser;
    //         // lets check the user if already created or then ask him to login otherwise create the token for that .
    //         let email = {
    //             email: payload.email
    //         }
    //         let checkMail = await ENTITY.UserE.getOneEntity(email, ['email', 'id_'])

    //         if (!checkMail) {
    //             let dataToSave = {
    //                 email: payload.email,
    //                 type: Constant.DATABASE.USER_TYPE.GUEST.TYPE,
    //                 name: payload.name,
    //                 userName: payload.name,
    //             }
    //             // let createGuestUser = await ENTITY.UserE.updateOneEntity(email, dataToSave, { upsert: true })
    //             createGuestUser = await ENTITY.UserE.createOneEntity(dataToSave);
    //             console.log('createGuestUser', createGuestUser);
    //             // now create the enquiry of the user
    //             // let enquiryData = {
    //             //     name: payload.name,
    //             //     email: payload.email,
    //             //     userId: createGuestUser._id ,
    //             // }
    //             payload.userId = createGuestUser._id;
    //             let createEnquiry = ENTITY.EnquiryE.createOneEntity(payload)
    //             console.log('createEnquirycreateEnquiry', createEnquiry);

    //             // createGuestUser._id
    //             return createEnquiry
    //         }
    //         else {
    //             // check the [previoi=us data of the user
    //             payload.userId = checkMail._id;
    //             let createEnquiry = await ENTITY.EnquiryE.createOneEntity(payload)
    //             return createEnquiry
    //         }
    //         // return enquiryData
    //     } catch (error) {
    //         utils.consolelog('error', error, true)
    //         return Promise.reject(error)
    //     }
    // }

    async createEnquiry(payload: EnquiryRequest.CreateEnquiry) {
        try {
            let createGuestUser;
            const email = {
                email: payload.email,
            };
            const propertyOwner = {
                _id: payload.propertyId,
            };
            const propertyOnwerId = await ENTITY.PropertyE.getOneEntity(propertyOwner, ['userId', '_id']);
            const checkMail = await ENTITY.UserE.getOneEntity(email, ['email', 'id_']);

            if (!checkMail || checkMail) {
                const dataToSave = {
                    email: payload.email,
                    type: !checkMail ? Constant.DATABASE.ENQUIRY_TYPE.GUEST.NUMBER : Constant.DATABASE.ENQUIRY_TYPE.REGISTERED_USER.NUMBER,
                    name: payload.name,
                    phoneNumber: payload.phoneNumber,
                    userName: payload.name,
                    propertyId: payload.propertyId,
                    userId: propertyOnwerId ? propertyOnwerId['userId'] : null,
                };
                // let createGuestUser = await ENTITY.UserE.updateOneEntity(email, dataToSave, { upsert: true })
                createGuestUser = await ENTITY.EnquiryE.createOneEntity(dataToSave);
                return createGuestUser;
            }
            // return enquiryData
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    // async createAuthEnquiry(payload: EnquiryRequest.createEnquiry) {
    //     try {
    //         let enquiryData = await ENTITY.EnquiryE.createOneEntity(payload);
    //         console.log('enquiryDataenquiryData', enquiryData);

    //         return enquiryData

    //     } catch (error) {
    //         return Promise.reject(error)
    //     }
    // }

    // async getEnquiryList(userData) {
    //     try {
    //         // let pipeline = [];
    //         const pipeLine = [
    //             {
    //                 $lookup: {
    //                     from: 'User',
    //                     let: { user_Id: '$userData._id' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$userId', '$$user_Id'],
    //                                 },
    //                             },
    //                         },
    //                         {
    //                             $project: {
    //                                 // fullName: 1,
    //                                 _id: 1,
    //                             },
    //                         },
    //                     ],
    //                     as: 'enquiryData',
    //                 },
    //             },
    //             {
    //                 $unwind: {
    //                     path: '$enquiryData',
    //                     preserveNullAndEmptyArrays: true,
    //                 },
    //             },
    //             {
    //                 $project: {
    //                     updatedAt: 1,
    //                     createdAt: 1,
    //                     enquiry_status: 1,
    //                     message: 1,
    //                     userId: 1,
    //                     propertyId: 1,
    //                     //     'property_address.region': '$regionData.fullName',
    //                     //     'property_address.regionId': '$regionData._id',
    //                 },
    //             },
    //             // {
    //             //     $sort: sortingType,
    //             // },
    //         ];

    //         const propertyData = await ENTITY.EnquiryE.enquiryList(pipeLine);

    //         return propertyData;

    //     } catch (error) {
    //         utils.consolelog('error', error, true);
    //         return Promise.reject(error);
    //     }
    // }

    async getEnquiryList(userData) {
        try {
            const pipeLine = [
                {
                    $lookup: {
                        from: 'Property',
                        let: { userId: '$userData._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$userId', '$$userId'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    property_basic_details: 1,
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'enquiryData',
                    },
                },
                {
                    $unwind: {
                        path: '$enquiryData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        updatedAt: 1,
                        createdAt: 1,
                        enquiry_status: 1,
                        message: 1,
                        userId: 1,
                        propertyId: 1,
                        title: '$property_basic_details.title',
                    },
                },
                // {
                //     $sort: sortingType,
                // },
            ];

            const propertyData = await ENTITY.EnquiryE.enquiryList(pipeLine);
            // const propertyData = await ENTITY.EnquiryE.enquiryList1(pipeLine);

            return propertyData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }

    async getEnquiryById(payload: EnquiryRequest.GetInquiryById) {
        try {
            const criteria = {
                _id: payload.enquiryId,
            };
            const getData = await ENTITY.EnquiryE.getOneEntity(criteria, {});
            return getData;

        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let EnquiryService = new EnquiryController();

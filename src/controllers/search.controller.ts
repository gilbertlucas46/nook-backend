
import * as config from 'config';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
const cert: any = config.get('jwtSecret');
export class SearchController {
	/**
	 *
	 * @param payload user detail
	 */
    async search(payload, userData) {
        try {
            const { text } = payload;
            let matchObject: any = {};
            let enquiryObject: any = {};
            // matchObject = {
            const promiseArr: Array<object> = [];
            console.log('payloadpayloadpayload', payload);

            // }
            if (payload.text) {
                // for filtration
                matchObject = {
                    userId: userData._id,
                    $or: [
                        //         { 'property_address.address': new RegExp('.*' + text + '.*', 'i') },
                        //         // { 'property_address.barangay': new RegExp('.*' + text + '.*', 'i') },
                        //        // { 'property_basic_details.title': new RegExp('.*' + text + '.*', 'i') },
                        //         { 'property_added_by.firstName': new RegExp('.*' + text + '.*', 'i') },
                        //         { 'property_added_by.lastName': new RegExp('.*' + text + '.*', 'i') },
                        //     ],
                        // },
                        // { <field>: { $regex: /pattern/, $options: '<options>' } }
                        { 'property_address.address': { $regex: text, $options: 'i' } },
                        { 'property_basic_details.title': { $regex: text, $options: 'i' } },
                        { 'property_added_by.firstName': { $regex: text, $options: 'i' } },
                        { 'property_added_by.lastName': { $regex: text, $options: 'i' } },
                    ],
                };
            }

            if (true) {
                console.log('userData._id: ', userData._id);
                enquiryObject = {
                    userId: userData._id,
                    $or: [
                        { phoneNumber: { $regex: text, $options: 'i' } },
                        { email: { $regex: text, $options: 'i' } },
                    ],
                };
            }

            // by the phone number

            promiseArr.push(ENTITY.PropertyE.getMultiple(matchObject, { property_features: 0 }));
            promiseArr.push(ENTITY.PropertyE.count(matchObject));

            promiseArr.push(ENTITY.EnquiryE.getMultiple(enquiryObject, {}));
            promiseArr.push(ENTITY.EnquiryE.count(enquiryObject));

            const [propertyData, propertyTotal, enquiryData, enquiryTotal] = await Promise.all(promiseArr)
            return { propertyData, propertyTotal, enquiryData, enquiryTotal };
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}
export let searchController = new SearchController();

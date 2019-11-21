
import * as config from 'config';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
const cert: any = config.get('jwtSecret');
export class SearchController {
	/**
	 * @function search
	 * @description global search on the property and enquiry
	 * @payload  adminData:adminData
	 * return {}
	 */
    async search(payload, userData) {
        try {
            const { text } = payload;
            let matchObject: any = {};
            let enquiryObject: any = {};
            const promiseArr: Array<object> = [];
            if (payload.text) {
                matchObject = {
                    userId: userData._id,
                    $or: [
                        // { 'property_address.address': new RegExp('.*' + text + '.*', 'i') },
                        { 'property_address.address': { $regex: text, $options: 'i' } },
                        { 'property_basic_details.title': { $regex: text, $options: 'i' } },
                        { 'property_added_by.firstName': { $regex: text, $options: 'i' } },
                        { 'property_added_by.lastName': { $regex: text, $options: 'i' } },
                    ],
                };
            }
            // var text = '42px';
            // var integer = parseInt(text, 10);

            if (payload.text) {
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

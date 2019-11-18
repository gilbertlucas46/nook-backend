
import * as config from 'config';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
const cert: any = config.get('jwtSecret');
export class SearchController {
	/**
	 *
	 * @param payload user detail
	 */
    async search(payload) {
        try {
            const { text } = payload;
            let matchObject: any = {};
            // matchObject = {

            // }
            if (payload.text) {
                // for filtration
                matchObject = {
                    $match: {
                        $or: [
                            { 'property_address.address': new RegExp('.*' + text + '.*', 'i') },
                            // { 'property_address.barangay': new RegExp('.*' + text + '.*', 'i') },
                            // { 'property_added_by.userName': new RegExp('.*' + text + '.*', 'i') },
                            // { 'property_added_by.email': new RegExp('.*' + text + '.*', 'i') },
                            { 'property_basic_details.title': new RegExp('.*' + text + '.*', 'i') },
                            { 'property_added_by.firstName': new RegExp('.*' + text + '.*', 'i') },
                            { 'property_added_by.lastName': new RegExp('.*' + text + '.*', 'i') },
                        ],
                    },
                };
            }

        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export let searchController = new SearchController();

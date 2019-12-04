import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { PropertyRequest } from '@src/interfaces/property.interface';

class CityController {
    constructor() { }
    /**
     * @description Function to get list of most popular cities ie which contains max number of active properties.
     * @param payload
     */

    async popularCities(payload: PropertyRequest.IPaginate) {
        try {
            return await ENTITY.cityEntity.getPopularCity(payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async featuredCities() {
        try {
            return await ENTITY.cityEntity.featuredList();
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async cityData(payload ) {
        try {
            return await ENTITY.PropertyE.getPropertyViaCity(payload);
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let CityService = new CityController();

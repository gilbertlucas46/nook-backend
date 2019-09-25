import * as ENTITY from '@src/entity';
import * as utils from '@src/utils/index';
import { PropertyRequest } from '@src/interfaces/property.interface';

class CityController {
    constructor() { }

    async popularCities(payload: PropertyRequest.IPaginate) {
        try {
            const cities = await ENTITY.PropertyE.popularCities(payload);
            return cities;
        } catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}

export let CityService = new CityController();
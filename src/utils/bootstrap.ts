import * as config from 'config';
import {Database} from '../databases';
const displayColors = config.get('displayColors');

export  class Bootstrap
{
    private dataBaseService = new Database();
      async bootstrap(server) {
        try {
            await this.dataBaseService.connectDatabase();
            
        } catch (error) {
            console.error(displayColors ? '\x1b[31m%s\x1b[0m' : '%s', error.toString())
        }
        return;
    }
}

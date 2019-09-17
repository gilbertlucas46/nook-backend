import * as authtoken from './auth-token';
import * as swagger from './swagger';
import * as good from './good';

export let plugins = [].concat(authtoken, swagger, good);

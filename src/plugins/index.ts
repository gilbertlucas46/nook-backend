import * as authtoken from './auth-token';
import * as swagger from './swagger';
import * as good from './good';

export let plugins = [].concat(authtoken, swagger, good);

// Date.prototype.shortId = function(this: Date) {
//     return `${this.getFullYear().toString().substr(-2)}${this.getMonth()}${this.getDate()}`;
// };
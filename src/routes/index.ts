"use strict"

//User Endpoints
import { userRoute } from './user/user.routes';
import { propertyRoute } from './property/property.routes';
import { adminProfileRoute } from './admin/admin.routes';

export let Routes = [];
Routes = Routes.concat(userRoute, propertyRoute, adminProfileRoute);


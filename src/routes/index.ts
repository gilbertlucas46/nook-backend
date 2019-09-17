"use strict"

//User Endpoints
import { userRoute } from './user/user.routes';
import { propertyRoute } from './property/property.routes';
import { adminRoutes } from './admin/admin.routes';
import { enquiryRoutes } from './enquiry/enquiry.routes'

export let Routes = [];
Routes = Routes.concat(userRoute, propertyRoute, adminRoutes, enquiryRoutes);


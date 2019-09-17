import { ServerRoute } from 'hapi';
import { userRoute } from './user/user.routes';
import { propertyRoute } from './property/property.routes';
import { adminProfileRoute } from './admin/admin.routes';
import { contentRoutes } from './content/content.routes';
import { enquiryRoutes } from './enquiry/enquiry.routes';
export let Routes: ServerRoute[] = [
	...userRoute,
	...propertyRoute,
	...adminProfileRoute,
	...contentRoutes,
	...enquiryRoutes,
];

import { ServerRoute } from 'hapi';
import { userRoute } from './user/user.routes';
import { propertyRoute } from './property/property.routes';
import { adminProfileRoute } from './admin/admin.routes';
import { contentRoutes } from './content/content.routes';
import { enquiryRoutes } from './enquiry/enquiry.routes';
import { articleRoutes } from './article/article.routes';
import { cityRoutes } from './city/city.routes';
import { agentRoute } from './user/agent.routes';
import { helpCenterRoute } from './helpCenter/helpCenter.routes';
import { savedProperty } from './savedProperty/savedProperty.routes';

export let Routes: ServerRoute[] = [
	...userRoute,
	...propertyRoute,
	...adminProfileRoute,
	...contentRoutes,
	...enquiryRoutes,
	...articleRoutes,
	...cityRoutes,
	...agentRoute,
	...helpCenterRoute,
	...savedProperty,
];

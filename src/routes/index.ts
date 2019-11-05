import { ServerRoute } from 'hapi';
import { userRoute } from './user/user.routes';
import { propertyRoute } from './property/property.routes';
import { adminProfileRoute } from './admin/admin.routes';
import { subAdminRoutes } from './admin/sub.admin.routes';
import { contentRoutes } from './content/content.routes';
import { enquiryRoutes } from './enquiry/enquiry.routes';
import { articleRoutes } from './article/article.routes';
import { cityRoutes } from './city/city.routes';
import { agentRoute } from './user/agent.routes';
import { helpCenterRoute } from './helpCenter/helpCenter.routes';
import { savedProperty } from './property/savedProperty.routes';
import { loanRoute } from './loans/loan.routes';
import { preloanRoute } from './loans/preloan.routes';
import { paymentRoute } from './payments/payment.routes';
import { loanReferral } from './referral/loanReferral.routes';
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
	...subAdminRoutes,
	...loanRoute,
	...preloanRoute,
	...paymentRoute,
	...loanReferral,
];

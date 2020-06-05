import { ServerRoute } from 'hapi';

import { userRoute } from './user/user.routes';
// import { propertyRoute } from './property/property.routes';
import { adminProfileRoute } from './admin/admin.routes';
import { subAdminRoutes } from './admin/sub.admin.routes';
import { contentRoutes } from './content/content.routes';
// import { enquiryRoutes } from './enquiry/enquiry.routes';
import { articleRoutes } from './article/article.routes';
import { cityRoutes } from './city/city.routes';
// import { agentRoute } from './user/agent.routes';
import { helpCenterRoute } from './helpCenter/helpCenter.routes';
// import { savedProperty } from './property/savedProperty.routes';
import { loanRoute } from './loans/loan.routes';
import { preloanRoute } from './loans/preloan.routes';
// import { transactionRoute } from './transaction/transaction.routes';
import { loanReferral } from './referral/loanReferral.routes';
import { searchRoutes } from './search.routes';
// import { subscriptionRoute } from './subscription/subscription.routes';
import { adminUserRoutes } from './admin/admin.user.routes';
// import { adminProperty } from './admin/admin.property.routes';
import { preQualificationroutes } from './preQualification/preQualification.routes';
import { partnerRoutes } from './partner/partner.routes';
import { helpCenterCategoryRoutes } from './helpCenter/helpcenter.categories.routes';

// const arr = [];
export let Routes: ServerRoute[] = [
	...userRoute,
	// ...propertyRoute,
	...adminProfileRoute,
	...contentRoutes,
	// ...enquiryRoutes,
	...articleRoutes,
	...cityRoutes,
	// ...agentRoute,
	...helpCenterRoute,
	// ...savedProperty,
	...subAdminRoutes,
	...loanRoute,
	...preloanRoute,
	// ...transactionRoute,
	...loanReferral,
	...searchRoutes,
	// ...subscriptionRoute,
	...adminUserRoutes,
	...preQualificationroutes,
	...partnerRoutes,
	...helpCenterCategoryRoutes,

	// ...adminProperty,
	// {
	// 	method: ['*'],
	// 	path: '/{any*}',
	// 	handler: (request, h) => {
	// 		const accept = request.url.pathname;
	// 		let arr = [];
	// 		arr.push(Routes.map(data => data.path));
	// 		// if (arr[0].match(accept)) {
	// 		// 	return Promise.reject('This resource isn’t available.');
	// 		// }
	// 		if (arr[0].includes([accept])) {
	// 			return;
	// 		} else {
	// 			return Promise.reject(' this resource isn’t available.');
	// 		}
	// 		// if (accept && accept.match(arr[0])) {\
	// 		// 	return Promise.reject(' this resource isn’t available.');
	// 		// }
	// 		return;
	// 	},
	// },
];
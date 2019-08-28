"use strict"

//User Endpoints
import { userRoute } from './user/user.routes'
import { propertyRoute } from './property/property.routes'
// import { anonymousRoute } from "./User/anonymous.user.route";


export let Routes = []

Routes = Routes.concat(userRoute, propertyRoute)//


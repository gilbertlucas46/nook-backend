"use strict"

//User Endpoints
import { userRoute } from './user/user.routes'

// import { anonymousRoute } from "./User/anonymous.user.route";
// import { friendRoute } from "./Friend/friend.route";
// import { directChatRoute } from "./Chat/direct.chat.route";
// import { commonChatRoute } from "./Chat/common.chat.route";


export let Routes = []

Routes = Routes.concat(userRoute)// anonymousRoute, friendRoute, directChatRoute, commonChatRoute);


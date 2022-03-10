
import { BaseEntity } from "@src/entity/base/base.entity";
import * as _ from 'lodash';
import * as Constant from "@src/constants";
import { Types } from "mongoose";
import { LoanRequest } from "@src/interfaces/loan.interface";
import * as utils from '@src/utils';
import { NotificationRequest } from "@src/interfaces/notification.interface";

class HistoryEntities extends BaseEntity {
  constructor() {
    super("History");
  }
//   async notificationList(payload:NotificationRequest.INotificationList) {
//     try {
//       const { 
//         limit = Constant.SERVER.LIMIT,
//         page = 1,
//     } = payload;
//     const skip = (limit * (page - 1));

//     const paginateOptions = {
//         page: page || 1,
//         limit: limit || Constant.SERVER.LIMIT,
//     };
//     const matchPipeline = [
      
//       {
//           $sort: {
//               _id: -1,
//           },
//       },
//       {
//           $project: {
//               _id: 1,
//               loanId:1,
//               message:1,
//               isRead:1,
//               notificationType:1,
//               createdAt:1

//           },
//       },
//   ];
//   const notificationList = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
//       // const notificationList = await this.DAOManager.findAll(
//       //   "Notification",
//       //   {},
//       //   { referralId: 1, message: 1, isRead: 1, createdAt: 1 }
//       // );
//       return notificationList;
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
    
  async getDifference(origObj, newObj) {
    let allID:String[]=["assignedTo","_id","adminId","userId","bankId"]
    debugger;
   async function changes(newObj, origObj) {
     let arrayIndexCounter = 0
     return _.transform(newObj, function (result, value, key) {
         if(allID.indexOf(key)===-1){
       //   console.log("keyyyyyyy",key)
       if (!_.isEqual(value, origObj[key])) {
         let resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key
         if(allID.indexOf(resultKey)===-1){
           //   console.log(resultKey)
         result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value
         }
       }
   }
       // if(!Object.values(result).length) delete result
     })
   }
   return changes(newObj, origObj)
 }

    async saveHistory(prevData,diffData,updatedBy) {
            
        try {
            let message:string[]=[]
            for (let key in diffData) {
                let NewValue = diffData[key];
                let preValue=prevData[key];
                 
                   // if(keyCheck.indexOf(key)!==-1 && key!=="applicationStatus"&& key!=="documents"&& key!=="dependentsInfo")
                if(Constant.DATABASE.KEY_CHECK.indexOf(key)!==-1 && Constant.DATABASE.SUB_KEY_CHECK.indexOf(key)===-1){
                    for (let key1 in NewValue){
                        if(Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)===-1){
                            preValue[key1] = String(preValue[key1]).length ? preValue[key1] : "Empty"
                            message.push(`Changed ${key} > ${key1} from ${preValue[key1]} to ${NewValue[key1]}`); 
                                       // `Changed ${key} ${key1} from ${val1[key1]} to ${value[key1]}`
                       
                        }
                        if(Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)!==-1){
                            message.push(`changed ${key1} in ${key}`); 
                               // `changed ${key1} details in ${key}`
                        }
                    }
                       
                }
               
                if(key==="applicationStatus" ){
                    message.push(`changed ${key} from ${preValue} to ${NewValue}`); 
                                       
                }
                   // if(key ==="documents"){
                   //     for (let key1 in value){
                   //         action.push( "had made the change in " + key1) ; 
                          
                   // }
                   // }
                if(key ==="dependentsInfo" || key === "tradeReferences"){
                    message.push( `Had made the change in ${key}` );
                          
                   
                }
            }
             
            let data={
              loanId:prevData.id,
              action:message,
              user:updatedBy
            }
            this.DAOManager.saveData("History", data);
            } catch (error) {
              return Promise.reject(error);
            }
    } 
   
  }
  



export const HistoryE = new HistoryEntities();

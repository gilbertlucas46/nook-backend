
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
    
//   async getDifference(origObj, newObj) {
//     let allID:String[]=["assignedTo","_id","adminId","userId","bankId"]
//     debugger;
//      function changes(newObj, origObj) {
//      let arrayIndexCounter = 0
//      return  _.transform(newObj,async function (result, recentData, key) {
//          if(allID.indexOf(key)===-1){
//        //   console.log("keyyyyyyy",key)
//        if (!_.isEqual(recentData, origObj[key])) {
//          let resultKey = _.isArray(origObj) ? arrayIndexCounter++ : key
//          if(allID.indexOf(resultKey)===-1){
//            //   console.log(resultKey)
//          result[resultKey] = (_.isObject(recentData) && _.isObject(origObj[key])) ? changes(recentData, origObj[key]) : recentData
//          }
//        }
//    }
//        // if(!Object.values(result).length) delete result
//      })
//    }
//    return await changes(newObj, origObj)
//  }
    
async updatedLogsList(payload) {
  try {
    const { 
      limit = Constant.SERVER.LIMIT,
      page = 1,
  } = payload;
  const skip = (limit * (page - 1));

  const paginateOptions = {
      page: page || 1,
      limit: limit || Constant.SERVER.LIMIT,
  };
  const matchPipeline = [
    {
      $match: {
          
             loanId:Types.ObjectId(payload.loanId)
          
      },
  },
    {
        $sort: {
            _id: -1,
        },
    },
    {
        $project: {
            _id: 1,
            loanId:1,
            user:1,
            action:1,
            createdAt:1

        },
    },
];
const updatedLogList = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
    
return updatedLogList ;
  } catch (error) {
    return Promise.reject(error);
  }
}

    async saveHistory(prevData,diffData,updatedBy) {
            
        try {
            let message:string[]=[]
            for (let key in diffData) {
                let recentData = diffData[key];
                let oldData=prevData[key];
             
               
               if(Constant.DATABASE.KEY_CHECK.indexOf(key)!==-1 && Constant.DATABASE.SUB_KEY_CHECK.indexOf(key)===-1){
                   for (let key1 in recentData){
                       if(Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)===-1 && oldData[key1]!==recentData[key1]){
                           oldData[key1] = String(oldData[key1]).length ? oldData[key1] : "Empty"
                           message.push(`Changed ${key} > ${key1} from ${oldData[key1]} to ${recentData[key1]}`); 
                                 
                       }
                       
                       if(JSON.stringify(recentData[key1])!==JSON.stringify(oldData[key1]) && Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)!==-1 ){
                       
                           message.push(`changed ${key1} in ${key}`); 
                   
                       }
                   }
                   
               }
           
               if(key==="applicationStatus" && recentData[key]!==oldData[key]){
                           message.push(`changed ${key} from ${oldData} to ${recentData}`); 
                                   
                   }
               if(key ==="documents"){
                   
                for (let key1 in recentData){
                    let counter=0
                    if(key1!=="purchasePropertyInfo" && recentData[key1].length===oldData[key1].length){
                    for (let key3=0; key3<recentData[key1].length;key3++){
                      console.log("keyyyyy==>>>>",key1,key3)
                      let recentUrl = (!recentData[key1][key3]['url'])?  "No Link": recentData[key1][key3]['url']
					            let oldUrl  = (!oldData[key1][key3]['url'])? "No Link": oldData[key1][key3]['url'] 
                       if((recentUrl!==oldUrl) && counter<1){
                          message.push( `Had made the change in ${key1}` );
                          counter=1
                      }  
                    }
                           
                      }if(key1==="purchasePropertyInfo" && JSON.stringify(recentData[key1])!==JSON.stringify(oldData[key1]) ){
                            message.push(`Had made the change in ${key1}`)
                }
                }
            }
               if(key ==="dependentsInfo" || key === "tradeReferences"){
                   for (let key1 in recentData){
                       if(JSON.stringify(recentData[key1])!==JSON.stringify(oldData[key1])){
                           message.push( `Had made the change in ${key}` );
                       }
                   }
               }
           }
           console.log(message)
           if(message.length>0){  
            let data={
              loanId:prevData.id,
              user:updatedBy,
              action:message,
            }
            console.log(data)
            this.DAOManager.saveData("History", data);
          }
            } catch (error) {
              return Promise.reject(error);
            }
    } 
   
  }
  



export const HistoryE = new HistoryEntities();

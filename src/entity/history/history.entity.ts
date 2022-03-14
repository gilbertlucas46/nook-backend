
import { BaseEntity } from "@src/entity/base/base.entity";
import * as _ from 'lodash';
import * as Constant from "@src/constants";
import { Types } from "mongoose";

class HistoryEntities extends BaseEntity {
  constructor() {
    super("History");
  }

  async updateHistoryList(payload) {
    try {
      const limit = payload['limit'];
      const page = payload['page'] ;
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
      const updateHistoryList = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
    
      return updateHistoryList ;
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
                        for (let subKey in recentData[key1]){
                          if( oldData[key1][subKey]!==recentData[key1][subKey]){
                            oldData[key1][subKey] = (!oldData[key1][subKey]) ?  "Empty": oldData[key1][subKey]
                            message.push(`Changed ${key} > ${key1} > ${subKey} from ${oldData[key1][subKey]} to ${recentData[key1][subKey]}`); 
                                    
                          }
                          //  message.push(`changed ${key1} in ${key}`); 
                   
                       }
                      }
                   }
                   
               }
           
               if(key==="applicationStatus" && recentData[key]!==oldData[key]){
                           message.push(`changed ${key} from ${oldData} to ${recentData}`); 
                                   
                   }
               if(key ==="documents"){
                   
                for (let key1 in recentData){
                   
                    if(key1!=="purchasePropertyInfo" && Constant.DATABASE.DOCUMENTS_KEY_CHECK.indexOf(key1)!==-1 && recentData[key1].length===oldData[key1].length){
                    for (let key3=0; key3<recentData[key1].length;key3++){
                      // console.log("keyyyyy==>>>>",key1,key3)
                      let recentUrl = (!recentData[key1][key3]['url'])?  "No Link": recentData[key1][key3]['url']
					            let oldUrl  = (!oldData[key1][key3]['url'])? "No Link": oldData[key1][key3]['url'] 
                       if((recentUrl!==oldUrl) &&  recentUrl==="No Link"){

                          message.push( ` ${key1} > ${recentData[key1][key3]['documentRequired']} had been removed` );
                        }
                        else if(recentUrl!==oldUrl && recentData!=="No Link"){
                          //  console.log("url",arr[key3]["url"])
                          
                          message.push( ` ${key1} > ${recentData[key1][key3]['documentRequired']} had been updated` );
                          
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

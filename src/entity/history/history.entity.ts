
import { BaseEntity } from "@src/entity/base/base.entity";
import * as _ from 'lodash';
import * as Constant from "@src/constants";
import { Types } from "mongoose";
import { object } from "joi";

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
            const applicationId=prevData.id;
            diffData=diffData.toJSON();
            prevData=prevData.toJSON();
            // console.log("prevdata====>>",prevData)
            // console.log("diffdata==>>",diffData)
            // console.log(Object.keys(diffData));
        try {
            let message:string[]=[]
            for (let key in diffData) {
                let recentData = diffData[key];
                let oldData=prevData[key];
             
               
               if(Constant.DATABASE.KEY_CHECK.indexOf(key)!==-1 && Constant.DATABASE.SUB_KEY_CHECK.indexOf(key)===-1){
                    for (let key1 in recentData){
                       if(Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)===-1 && recentData[key1] && oldData[key1]!==recentData[key1]){
                           oldData[key1] = (oldData[key1]) ? oldData[key1] : "Empty"
                           message.push(`Changed ${key} > ${key1} from ${oldData[key1]} to ${recentData[key1]}`); 
                                 
                       }
                       
                       if(JSON.stringify(recentData[key1])!==JSON.stringify(oldData[key1]) && Constant.DATABASE.SUB_KEY_CHECK.indexOf(key1)!==-1 ){
                        for (let subKey in recentData[key1]){
                          if(recentData[key1][subKey] && oldData[key1][subKey]!==recentData[key1][subKey]){
                            oldData[key1][subKey] = (!oldData[key1][subKey]) ?  "Empty": oldData[key1][subKey]
                            message.push(`Changed ${key} > ${key1} > ${subKey} from ${oldData[key1][subKey]} to ${recentData[key1][subKey]}`); 
                                    
                          }
                          //  message.push(`changed ${key1} in ${key}`); 
                   
                       }
                      }
                   }
                   
               }
               else if(key==="loanAttorneyInfo" ){
                for(const subKey in recentData){
               //    console.log(prevData.hasOwnProperty(key))
                if(!prevData.hasOwnProperty(key) && diffData.hasOwnProperty(key) && recentData[subKey]){
                  message.push(`Had updated ${key} > ${subKey} to ${recentData[subKey]}`)
                }
                else if(prevData.hasOwnProperty(key) && diffData.hasOwnProperty(key) ){
                  const prevSubData = String(oldData[subKey]).length? oldData[subKey] : "Empty"
                  const newSubData= String(recentData[subKey]).length? recentData[subKey] : "Empty"
                  if(prevSubData!==newSubData){
                    message.push(`Changed ${key} > ${subKey} from ${prevSubData} to ${newSubData}`)
                  }
                }
             }
              }
           
              else if(key==="applicationStatus" && recentData!==oldData){
                           message.push(`Changed ${key} from ${oldData} to ${recentData}`); 
                                   
                   }
              else if(key ==="documents"){
                   
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
            else if(key ==="dependentsInfo" || key === "tradeReferences"){
                   for (let key1 in recentData){
                       if(JSON.stringify(recentData[key1])!==JSON.stringify(oldData[key1])){
                           message.push( `Had made the change in ${key}` );
                       }
                   }
               }
           }
            // console.log(message)
           if(message.length>0){  
            let data={
              loanId:applicationId,
              user:updatedBy,
              action:message,
            }
            // console.log(data)
            this.DAOManager.saveData("History", data);
          }
            } catch (error) {
              return Promise.reject(error);
            }
    } 
   
  }
  



export const HistoryE = new HistoryEntities();

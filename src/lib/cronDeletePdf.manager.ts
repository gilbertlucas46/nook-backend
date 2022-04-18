import * as cron from 'node-cron';
import  * as fs from 'fs';

const crons =cron.schedule('0 0 * * *',function(){
    console.log("<==========running cron every minute=======>")
    const path=`${process.cwd()}/src/views/loan/`
    console.log(path);
   fs.readdir(path,(err,files)=>{
       files.forEach(file=>{
           console.log(path+file)
           if(file.split('.')[1]==='pdf') {
               fs.unlink(path + file,err=>{
                   if(err) throw err
                //    console.log("all pdf deleted successfully")
               })
           }
       })
   })

});

export default crons
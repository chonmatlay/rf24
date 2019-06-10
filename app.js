const mysql = require ('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
app.listen(3030);
const statusDb= mysql.createConnection({
    host : "localhost",
    user : "root" ,
    password : "password",
    database : "status"
})
async function resetTime(time){
    time.setDate(1);
    time.setHours(0);
    time.setMinutes(0);
    time.setMilliseconds(0);
    time.setSeconds(0);
}
async function setWarning(val,curr ){
  if (val > curr ){
      let sql = await 'UPDATE warning SET value='+ val +' , flag=0';
      await statusDb.query(sql,(err,response)=>{
          if (err) throw err ;
      })
  } else {
    let sql =await 'UPDATE warning SET value='+ val ;
    await statusDb.query(sql,(err,response)=>{
        if (err) throw err ;
    })
  }
}
app.get('/getAllStatus',(req,res)=> {
    let sql = 'SELECT * FROM status'
    statusDb.query(sql,(err,response)=>{
        if(err) throw err 
        res.json(response)
    })
});
app.get('/getWarningValue',(req,res)=>{
    let sql = 'SELECT * FROM warning';
    statusDb.query(sql,(err , response)=>{
        if (err) throw err 
        res.json(response[0]);
    })
})
app.post('/updateStatus',urlencodedParser,(req,res)=>{
    let sql ='UPDATE status SET status=' +req.body.status +' WHERE id=' +req.body.id;
    statusDb.query(sql,(err,response)=>{
        if (err) throw err 
        res.json({status : "success"});
    })
})
app.post('/setWarning',urlencodedParser,async (req,res)=>{
    console.log(req.body);
    let now = new Date() ;
    await resetTime(now);
    let sql ='SELECT SUM(value) FROM power'
    statusDb.query(sql,async (err,response)=>{
        if (err) throw err 
        await setWarning(req.body.value , response[0]['SUM(value)'] );
        await res.json({status : "success"});
    })
    
})
app.get('/getListPower', (req,res)=> {
    let now = new Date();
    now.setHours(0);
    now.setMilliseconds(0);
    now.setMinutes(0);
    now.setSeconds(0);
   
    let sql = 'SELECT * FROM power WHERE day >=' + now.getTime();
    statusDb.query(sql,(err,response)=>{
        if (err) throw err;
        res.json(response);
    })  
})
app.get('/getOneListPower',urlencodedParser,(req,res)=>{
    let time= req.body.time;
    let next= time + 86400;
    let sql = 'SELECT * FROM power WHERE day>=' +time + ' AND day <='+next ;
    statusDb.query(sql , (err ,response)=> {
        if (err) throw err ;
        res.json(response);
    })
})

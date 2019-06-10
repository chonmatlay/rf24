const mysql = require ('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const mm = require('moment');
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
    let today = mm(now.getTime());
    let sql ='SELECT SUM(value) FROM power WHERE day>= ' + today.format('YYYY-MM-DD HH:mm:ss').toString() +'"';
    statusDb.query(sql,async (err,response)=>{
        if (err) throw err 
        await setWarning(req.body.value , response[0]['SUM(value)'] );
        await res.json({status : "success"});
    })
    
})
app.get('/getListPower', (req,res)=> {
    let now = mm();
    now.set('hour', 0);
    now.set('minute', 0);
    now.set('second', 0);
    now.set('millisecond', 0);
   
    let sql = 'SELECT * FROM power WHERE day >="'+now.format('YYYY-MM-DD HH:mm:ss').toString()+'"' ;
    statusDb.query(sql,(err,response)=>{
        if (err) throw err;
        res.json(response);
    })  
})
app.get('/getOneListPower',urlencodedParser,(req,res)=>{
    let time= mm(Number(req.body.time));
    console.log(time);
    let next= mm(Number(req.body.time) + 86400000);
    let sql = 'SELECT * FROM power WHERE day>="' +time.format('YYYY-MM-DD HH:mm:ss').toString() + '" AND day <="'+next.format('YYYY-MM-DD HH:mm:ss').toString()+'"' ;
    statusDb.query(sql , (err ,response)=> {
        if (err) throw err ;
        arr=response.map(item=> {return {
            value : item.value,
            date : mm(item.day).format('YYYY-MM-DD HH:mm:ss')
        }})
        res.json(arr);
    })
})
app.get('/getExtendList',urlencodedParser,(req,res)=>{
    let time= mm(Number(req.body.time))
    let sql = 'SELECT * FROM power WHERE day>="' +time.format('YYYY-MM-DD HH:mm:ss').toString()+'"' ;
    statusDb.query(sql , (err ,response)=> {
        if (err) throw err ;
        arr=response.map(item=> {return {
            value : item.value,
            date : mm(item.day).format('YYYY-MM-DD HH:mm:ss')
        }})
        res.json(arr);
    })
})
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
app.post('/setWarning',urlencodedParser,(req,res)=>{
    console.log(req.body);
    let sql ='UPDATE warning SET value=' +req.body.value ;
    statusDb.query(sql,(err,response)=>{
        if (err) throw err 
        res.json({status : "success"});
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

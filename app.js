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
    console.log(req.body);
    let sql ='UPDATE status SET status=' +req.body.status +' WHERE id=' +req.body.id;
    console.log(sql);
    statusDb.query(sql,(err,response)=>{
        if (err) throw err 
        res.json({status : "success"});
    })
})
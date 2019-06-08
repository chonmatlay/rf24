const mysql = require ('mysql');
const express = require('express');
const app = express();
app.listen(3000);
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
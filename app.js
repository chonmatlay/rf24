const express = require("express")
const bodyParser =require("body-parser");
app= express() ;
app.listen(3000) ;
const urlencodedParser = bodyParser.urlencoded({extended : false});

app.get('/',(req,res)=> {
    res.end("hello")
})
app.post('/rf24',urlencodedParser, (req,res)=>{
    let request = req.body
    res.send(request);
})

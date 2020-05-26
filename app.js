const express = require("express");
const app = express();
const port = process.env.PORT || 3000;  
const bodyParser = require('body-parser');
const funcs = require('./functions/users');


app.use('/', function(req, res, next) {
    var allowedOrigins = ['http://localhost:3000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// support parsing of application/json type post data
app.use(bodyParser.json());

app.post("/create", async (req, res)=>{
    res.json(await funcs.Create(req.body));
});

app.post("/read", async (req, res)=>{
    res.json(await funcs.Read(req.body));
});

app.post("/update", async (req, res)=>{
    res.json(await funcs.Update(req.body));
});

app.post("/delete", async (req, res)=>{
    res.json(await funcs.Delete(req.body));
});

app.listen(port, async function(error){
    if(error){
        return false;
    }
})    
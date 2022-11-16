var express = require('express');
var router = express.Router();

const {MongoClient, ObjectId} = require("mongodb");

async function connect(){
    console.log('entrou');
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true });
  if(!conn) return new Error("Can't connect");
  global.db = await conn.db("workshop");
  return global.db;
}

router.get('/id?', async function(req, res, next){
    try{
        const db = await connect();
        res.json(await db.collection("customers").find().toArray());
    }

    catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

router.post('/', async function(req, res, next){
    try{
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("customers").insertOne(customer));
    }
    catch(ex){
        console.log(ex);
        req.status(400).json({erro: `${ex}`});
    }
})

router.put('/:id', async function(req, res, next) {
    try{
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("customers").updateOne({_id: new ObjectId(req.params.id)},{$set:customer}));
    }
    catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`})
    }
})

router.delete('/:id', async function(req, res, next){
    try{
        const db = await connect();
        res.json(await db.collection("customers").deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

module.exports = router;
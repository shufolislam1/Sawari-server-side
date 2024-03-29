const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blrcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const uri = "mongodb+srv://sawari:${process.env.DB_PASS}@cluster0.d2i9gpr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try{
      await client.connect();
      const stocksCollection = client.db('sawari').collection('stocks')

      app.get('/stock', async(req, res) => {
        const query = {};
        const cursor = stocksCollection.find(query);
        const stocks = await cursor.toArray();
        res.send(stocks)
      })

      app.get('/stock/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const stock = await stocksCollection.findOne(query);
        res.send(stock)
      })

      app.get('/stockCount', async (req, res) => {
        const query = {}
        const cursor = stocksCollection.find(query);
        const count = await cursor.count()
        res.send({count})
      })

      app.put('/stock/:id', async (req, res) => {
         const id = req.params.id;
         const updateStock = req.body;
         const filter = {_id: ObjectId(id)};
         const options = {upsert: true};
         const updateDoc = {
           $set: {
             quantity: updateStock.quantity
           }
         };
         const result = await stocksCollection.updateOne(filter, updateDoc, options)
         res.send(result)
      })

      app.delete('/stock/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await stocksCollection.deleteOne(query);
        res.send(result)
      })

  }
  finally{

  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running sawari')
})

app.listen(port, () => {
    console.log('listening', port);
})
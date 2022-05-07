const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blrcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

  }
  finally{

  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running sawari')
})

app.listen(port, () => {
    console.log('listening', port);
})
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gwxst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('bicycleShop');
        const cyclesCollection = database.collection('cycles');

        //get cycles
        app.get('/cycles', async (req, res) => {
            const cursor = cyclesCollection.find({});
            const cycles = await cursor.toArray();
            res.json(cycles);
        })

        //get cycle by specific id
        app.get('/cycles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cyclesCollection.findOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Bicycle World!')
})

app.listen(port, () => {
    console.log(`app listening at: ${port}`)
})
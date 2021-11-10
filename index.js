const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
// const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

// DB_USER=JIWatch
// DB_PASS=cOVjtiVNFgjUpQCu

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sbyjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("JIWatch");
        const servicesCollection = database.collection("services");
        console.log('database connected')

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

    }

    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('JI Watch server running');
})

app.listen(port, () => {
    console.log('JI Watch running on port', port)
})

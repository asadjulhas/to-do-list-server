const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');



// Middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@doctors-services.1laqf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();

    const taskCollections = client.db('doctorsPortal').collection('tasks')
    
    // Get all task
    app.get('/task', async (req, res) => {
      const query = {};
      const cursor = taskCollections.find(query)
      const task = await cursor.toArray();
      res.send(task)
    })

    // Store Task list
    app.post('/task', async (req, res) => {
      const task = req.body;
      const result = await taskCollections.insertOne(task);
      res.send(result)
    })

     // Delete a task

 app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  const query = {_id: ObjectId(id)}
  const result = await taskCollections.deleteOne(query)
  res.send(result)
})

  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Clients')
})

app.listen(port, () => {
  console.log('Opening Doctor server on port', port)
})
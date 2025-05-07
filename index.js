import { DatabaseConnection } from "./DatabaseConnection.js";
import { ObjectId } from "mongodb";


// --- This is the standard stuff to get it to work on the browser
import express from 'express';
const path = import('path');
const app = express();
import bodyParser from 'body-parser';

const port = 3000;




app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//middlewares
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


// routes will go here

// Default route:
app.get('/', function(req, res) {
  // Rendering our web page i.e. Demo.ejs 
  // and passing title variable through it 
    res.render('Login'); 
});

app.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
});

app.get('/topics', function(req, res) {
  
  var databaseConnection = new DatabaseConnection();

  

  async function run() {
    try {
      
      await databaseConnection.connect();
      

      var query = {};

      const topics = await databaseConnection.find("topics", query);
      

      var query = {user_id: new ObjectId("681ab0f7df03cac7b065e9f6")};

      const subscriptions = await databaseConnection.find("subscribedTopics");

      var ids = [];

      subscriptions.forEach(subscription => {
        ids.push(subscription.topic_id);
      });

      var query = {_id: {$in: ids}};

      var subscribedTopics = await databaseConnection.find("topics", query);

      res.render('Topics', { subscribedTopics, topics });
      
  
    } finally {
      // Ensures that the client will close when you finish/error
      await databaseConnection.close();
    }
  }
  run().catch(console.dir);
})

app.post('/topics/add', function(req, res) {
  
  var databaseConnection = new DatabaseConnection();

  

  async function run() {
    try {
      
      await databaseConnection.connect();
      
      var newTopic = { name: req.body.name, user_id: new ObjectId("681ab0f7df03cac7b065e9f6")}
      
      
      var insertedDocument = await databaseConnection.insert("topics", newTopic);


      var newSubscribedTopic = {topic_id: insertedDocument._id, user_id: new ObjectId("681ab0f7df03cac7b065e9f6")}

      await databaseConnection.insert("subscribedTopics", newSubscribedTopic);


      res.redirect("/topics");
  
    } finally {
      // Ensures that the client will close when you finish/error
      await databaseConnection.close();
    }
  }
  run().catch(console.dir);
})

app.post('/topic/:id/subscribe', function(req, res) {
  
  var databaseConnection = new DatabaseConnection();

  

  async function run() {
    try {
      
      await databaseConnection.connect();
      
      
      var query = { topic_id: new ObjectId(req.params.id), user_id: new ObjectId("681ab0f7df03cac7b065e9f6")}

      var active = await databaseConnection.findOne("subscribedTopics", query);

      
      if (active) {
        await databaseConnection.delete("subscribedTopics", query);
      }

      else {
        var newSubscribedTopic = { topic_id: new ObjectId(req.params.id), user_id: new ObjectId("681ab0f7df03cac7b065e9f6")}

        await databaseConnection.insert("subscribedTopics", newSubscribedTopic);
      }

      res.redirect("/topics");
  
    } finally {
      // Ensures that the client will close when you finish/error
      await databaseConnection.close();
    }
  }
  run().catch(console.dir);
})

app.get('/topic/:id', function(req, res) {
  
  var databaseConnection = new DatabaseConnection();

  

  async function run() {
    try {
      
      await databaseConnection.connect();
      
      var query = { _id: new ObjectId(req.params.id) };
      const topic = await databaseConnection.findOne("topics", query)
      
      var query = { topic_id: new ObjectId(req.params.id) };
      const messages = await databaseConnection.find("messages", query);

      res.render('Messages', { topic, messages });
      
  
    } finally {
      // Ensures that the client will close when you finish/error
      await databaseConnection.close();
    }
  }
  run().catch(console.dir);
})

app.post('/topic/:id/add', function(req, res) {
  var content = req.body.content;
  var id = new ObjectId(req.params.id);

  var databaseConnection = new DatabaseConnection();

  

  async function run() {
    try {
      
      await databaseConnection.connect();
      
      var newMessage = {content: content, topic_id: new ObjectId(id), user_id: new ObjectId("681ab0f7df03cac7b065e9f6")};

      databaseConnection.insert("messages", newMessage);

      
      res.redirect("/topic/" + id)
      
  
    } finally {
      // Ensures that the client will close when you finish/error
      await databaseConnection.close();
    }
  }
  run().catch(console.dir);
});


app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});


// Route to access database:
app.get('/api/mongo/:item', function(req, res) {
var databaseConnection = new DatabaseConnection();

const searchKey = "{ partID: '" + req.params.item + "' }";
console.log("Looking for: " + searchKey);

async function run() {
  try {
    
    await databaseConnection.connect();
    // Hardwired Query for a part that has partID '12345'
    // const query = { partID: '12345' };
    // But we will use the parameter provided with the route
    const query = { partID: req.params.item };



    const part = await databaseConnection.findOne("MyStuff", query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await databaseConnection.close();
  }
}
run().catch(console.dir);
});
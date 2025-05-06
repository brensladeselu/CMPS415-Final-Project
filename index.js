import { DatabaseConnection } from "./DatabaseConnection.js";




// --- This is the standard stuff to get it to work on the browser
import express from "express";
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route:
app.get('/', function(req, res) {
  res.send('Starting... ');
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



    const part = await databaseConnection.findOne("MyStuff");
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await databaseConnection.close();
  }
}
run().catch(console.dir);
});
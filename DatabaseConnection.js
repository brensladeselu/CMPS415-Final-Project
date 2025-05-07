import { MongoClient } from 'mongodb';

export class DatabaseConnection {
  
  

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    DatabaseConnection.instance = this; 
    
    // The uri string must be the connection string for the database (obtained on Atlas).
    this.uri = "mongodb+srv://brennan:XQTJHeowyRbYGRg7@cmps415.sib745u.mongodb.net/?retryWrites=true&w=majority&appName=CMPS415";
    this.client = null;
    this.db = "";
    
  }

  async insert(table, document) {
    var collection = this.database.collection(table);

    var insertPromise = collection.insertOne(document);
    
    var insertedId = await insertPromise.then(function (result) {
      var insertedId = result.insertedId;

      return insertedId;

      
    })

    var query = {_id: insertedId}

    return this.findOne(table, query);
    
  }

  async find(table, query) {
    var collection = this.database.collection(table);
    
    var documents = await collection.find(query).toArray();

    return documents;
  }

  async findOne(table, query) {
    var collection = this.database.collection(table);
  
    var document = await collection.findOne(query)

    return document;
  }

  async delete(table, id) {
    var collection = this.database.collection(table);
    
    await collection.deleteOne();
  }

  async connect() {
    this.client = new MongoClient(this.uri);
    this.database = this.client.db('CMPS415_Project');
  }

  async close() {
    
    await this.client.close();
  }


}

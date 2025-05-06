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



  async find(table, query) {
    var collection = this.database.collection(table);
    
    var documents = await collection.find(query);

    return documents;
  }

  async findOne(table, query) {
    var collection = this.database.collection(table);
  
    var document = await collection.findOne(query)

    return document;
  }

  async connect() {
    
    if (this.client && this.client.isConnected()) {
      console.log("already connected!");
      return;
      
    }
    console.log("connected!");
    this.client = new MongoClient(this.uri);
    this.database = this.client.db('MyDBexample');
  }

  async close() {
    this.connect();
    console.log(this.client);
    await this.client.close();
  }


}

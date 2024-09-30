const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const port = process.env.PORT || 5445; // Default port if not specified in environment variables
const { MongoClient, ServerApiVersion } = require('mongodb');


// Middleware setup
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies


// MongoDB connection URI
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-esohqc9-shard-00-00.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-01.okia5sv.mongodb.net:27017,ac-esohqc9-shard-00-02.okia5sv.mongodb.net:27017/?ssl=true&replicaSet=atlas-mrsszx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;


// Create a new MongoClient instance
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, // Use Stable API version
        strict: true, // Enable strict mode to avoid deprecated features
        deprecationErrors: true, // Show deprecation warnings as errors
    },
});


// Function to connect to MongoDB
async function connectToDatabase() {
    try {

        await client.connect(); // Connect to MongoDB

        const db = client.db("eStore");
        const phoneCollection = db.collection("phones");

        // insert new product in database
        app.post('/phones', async (req, res) => {
            const product = req.body;
            console.log(product)
            try {
                const result = await phoneCollection.insertOne(product);
                res.send({ insertedId: result.insertedId });
                console.log(result);

            }
            catch (error) {
                console.error('Error adding product', error);
                res.send({ error: 'Failed to add product' })

            }
        })

        // get products from database
        app.get('/products', async (req, res) => {
            const result = await phoneCollection.find().toArray();
            res.send(result)
        })










        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit process on failure
    }
}

// Initiate the connection to MongoDB
connectToDatabase();

// Root route
app.get('/', (req, res) => {
    res.send('eStore is live');
});

// Start the server
app.listen(port, () => {
    console.log(`eStore is live on port ${port}`);
});
